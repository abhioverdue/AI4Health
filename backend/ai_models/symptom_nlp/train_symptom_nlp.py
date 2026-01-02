"""
CPU-friendly Symptom -> Disease classifier
small GRU-based RNN, trained from scratch
- Loads all datasets
- Dynamic augmentation: synonym replacement, symptom dropout, swaps, label mismatch
- Partial train/val swap each epoch for regularization
- Early stopping and LR scheduling

Usage: python train_symptom_nlp.py --data-dir dataset --epochs 10 --batch-size 32 --force-cpu
"""

import os, json, argparse, random, re
from collections import Counter

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader

#utilities
def clean_text(s):
    if not isinstance(s,str): return ""
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s]"," ",s)
    s = re.sub(r"\s+"," ",s).strip()
    return s

#data augmentation
MED_SYNONYMS = {
    "fever":["pyrexia","high temperature"],
    "cough":["dry cough","productive cough"],
    "headache":["cephalalgia","migraine"]
}

def augment_text(text,num_aug=1):
    tokens = text.split()
    augmented = []
    for _ in range(num_aug):
        new_tokens = tokens.copy()
        # synonym replacement
        for i,tok in enumerate(new_tokens):
            if tok in MED_SYNONYMS and random.random()<0.3:
                new_tokens[i]=random.choice(MED_SYNONYMS[tok])
        # random deletion
        new_tokens = [t for t in new_tokens if random.random()>0.1]
        # random swap
        if len(new_tokens)>1 and random.random()<0.3:
            i1,i2=random.sample(range(len(new_tokens)),2)
            new_tokens[i1],new_tokens[i2]=new_tokens[i2],new_tokens[i1]
        augmented.append(" ".join(new_tokens))
    return augmented

#load labeled data
def load_labeled_from_disease_csv_multi(path):
    df = pd.read_csv(path)
    symptom_cols = [c for c in df.columns if c.lower().startswith("symptom")]
    rows=[]
    for _,r in df.iterrows():
        symptoms = [str(r[c]) for c in symptom_cols if pd.notna(r.get(c))]
        text = " ; ".join([s for s in symptoms if s and s.lower() not in ["nan","none",""]])
        text = clean_text(text)
        label = str(r["Disease"]).strip() if pd.notna(r["Disease"]) else ""
        if text and label:
            rows.append((text,label))
    return rows

def load_medsquad_csv_multi(path):
    texts=[]
    if not os.path.exists(path): return texts
    df = pd.read_csv(path,dtype=str,keep_default_na=False)
    for _,r in df.iterrows():
        parts=[clean_text(str(r.get(c,"")).strip()) for c in ["question","answer","source","focus_area"] if r.get(c)]
        if parts: texts.append(" ; ".join(parts))
    return texts

def load_json_folder_all_fields(folder):
    texts=[]
    if not os.path.exists(folder): return texts
    for fname in os.listdir(folder):
        if not fname.endswith(".json"): continue
        fp=os.path.join(folder,fname)
        try:
            with open(fp,"r",encoding="utf-8") as f:
                data=json.load(f)
                if isinstance(data,list):
                    for entry in data:
                        if isinstance(entry,dict):
                            parts=[clean_text(v) for v in entry.values() if isinstance(v,str) and v.lower() not in ["nan","none"]]
                            if parts: texts.append(" ; ".join(parts))
        except: continue
    return texts

def collect_all_data_multi(data_dir):
    labeled=[]
    vocab_texts=[]

    disease_csv = os.path.join(data_dir,"diseaseandsymptoms.csv")
    if os.path.exists(disease_csv):
        labeled = load_labeled_from_disease_csv_multi(disease_csv)
        vocab_texts += [t for t,_ in labeled]
        print(f"[i] Loaded {len(labeled)} labeled rows from diseaseandsymptoms.csv")

    medcsv = os.path.join(data_dir,"medsquad.csv")
    ms_texts = load_medsquad_csv_multi(medcsv)
    vocab_texts += ms_texts
    print(f"[i] Loaded {len(ms_texts)} texts from medsquad.csv")

    for folder in ["healthcaremagic","icliniq"]:
        dir_path=os.path.join(data_dir,folder)
        texts=load_json_folder_all_fields(dir_path)
        vocab_texts += texts
        print(f"[i] Loaded {len(texts)} texts from {folder}/")

    return labeled, vocab_texts

# synthetic test creation
def create_synthetic_test(samples,fraction=0.2):
    num = max(1,int(len(samples)*fraction))
    return random.sample(samples,num)

# vocabulary
class Vocab:
    def __init__(self,min_freq=1,max_size=None,unk_token="<UNK>",pad_token="<PAD>"):
        self.min_freq=min_freq
        self.max_size=max_size
        self.unk_token=unk_token
        self.pad_token=pad_token
        self.token2idx={}
        self.idx2token=[]
    def build(self,texts):
        cnt=Counter()
        for t in texts: cnt.update(t.split())
        items=[tok for tok,c in cnt.items() if c>=self.min_freq]
        items.sort(key=lambda x:(-cnt[x],x))
        if self.max_size: items=items[:self.max_size]
        self.idx2token=[self.pad_token,self.unk_token]+items
        self.token2idx={t:i for i,t in enumerate(self.idx2token)}
    def encode(self,text):
        return [self.token2idx.get(tok,1) for tok in text.split()]
    def __len__(self): return len(self.idx2token)

# dataset
class SymptomDataset(Dataset):
    def __init__(self,samples,label_encoder,vocab):
        self.samples=samples
        self.le=label_encoder
        self.vocab=vocab
        self.encoded=[]
        for text,label in samples:
            ids=torch.tensor(vocab.encode(text),dtype=torch.long)
            lbl=int(label_encoder.transform([label])[0])
            self.encoded.append((ids,lbl))
    def __len__(self): return len(self.encoded)
    def __getitem__(self,idx): return self.encoded[idx]

def collate_batch(batch,max_len=50):
    ids,labels=zip(*batch)
    padded=torch.zeros(len(ids),max_len,dtype=torch.long)
    lengths=[min(len(seq),max_len) for seq in ids]
    for i,seq in enumerate(ids):
        end=min(len(seq),max_len)
        padded[i,:end]=seq[:end]
    return padded,torch.tensor(lengths,dtype=torch.long),torch.tensor(labels,dtype=torch.long)

# model
class SymptomClassifier(nn.Module):
    def __init__(self,vocab_size,embed_dim,hidden_dim,num_classes,pad_idx=0,dropout=0.3):
        super().__init__()
        self.embedding=nn.Embedding(vocab_size,embed_dim,padding_idx=pad_idx)
        self.encoder=nn.GRU(embed_dim,hidden_dim,bidirectional=True,batch_first=True)
        self.dropout=nn.Dropout(dropout)
        self.fc=nn.Linear(hidden_dim*2,num_classes)
    def forward(self,x,lengths):
        embedded=self.embedding(x)
        packed=torch.nn.utils.rnn.pack_padded_sequence(embedded,lengths.cpu(),batch_first=True,enforce_sorted=False)
        _,h_n=self.encoder(packed)
        h_cat=torch.cat([h_n[0],h_n[1]],dim=1)
        h_cat=self.dropout(h_cat)
        return self.fc(h_cat)

# training utilities
def topk_accuracy(preds,labels,k=5):
    topk=preds.topk(k,dim=1).indices
    correct=(topk==labels.unsqueeze(1)).any(dim=1).float().mean().item()
    return correct

def evaluate(model,dataloader,device):
    model.eval()
    total,top1_sum,top5_sum=0,0,0
    with torch.no_grad():
        for x,lengths,y in dataloader:
            x,lengths,y=x.to(device),lengths.to(device),y.to(device)
            logits=model(x,lengths)
            preds=logits.argmax(dim=1)
            top1_sum+=(preds==y).sum().item()
            top5_sum+=topk_accuracy(logits,y,k=min(5,logits.size(1)))*x.size(0)
            total+=x.size(0)
    return top1_sum/total if total else 0.0, top5_sum/total if total else 0.0

# Main
def main(args):
    random.seed(42)
    np.random.seed(42)
    torch.manual_seed(42)

    # Load datasets
    labeled, all_texts = collect_all_data_multi(args.data_dir)
    if not labeled: raise SystemExit("No labeled data found.")
    print(f"[i] Total labeled rows: {len(labeled)}")

    vocab = Vocab(min_freq=1,max_size=args.vocab_size)
    vocab.build(all_texts)
    le=LabelEncoder()
    le.fit([lab for _,lab in labeled])
    num_classes=len(le.classes_)
    print(f"[i] Vocab size: {len(vocab)}, classes: {num_classes}")

    # Synthetic test split
    synthetic_test=create_synthetic_test(labeled,fraction=0.2)
    train_samples=[s for s in labeled if s not in synthetic_test]
    val_samples=synthetic_test

    device=torch.device("cpu")
    model=SymptomClassifier(len(vocab),args.embed_dim,args.hidden_dim,num_classes,dropout=0.3)
    model.to(device)
    optimizer=torch.optim.Adam(model.parameters(),lr=args.lr,weight_decay=1e-5)
    scheduler=torch.optim.lr_scheduler.StepLR(optimizer,step_size=3,gamma=0.7)
    criterion=nn.CrossEntropyLoss()
    best_val,wait,patience=0,0,3
    swap_fraction=0.1

    for epoch in range(1,args.epochs+1):
        epoch_train=[]
        # Augment + random dropout/mismatch/swap
        for text,label in train_samples:
            tokens=text.split()
            tokens=[t for t in tokens if random.random()>0.3]
            if len(tokens)>1 and random.random()<0.2:
                i1,i2=random.sample(range(len(tokens)),2)
                tokens[i1],tokens[i2]=tokens[i2],tokens[i1]
            new_text=" ".join(tokens) if tokens else text
            # label mismatch 10%
            if random.random()<0.1:
                new_label=random.choice([lab for _,lab in train_samples if lab!=label])
                epoch_train.append((new_text,new_label))
            else: epoch_train.append((new_text,label))
            # synonym augment
            for aug in augment_text(text,num_aug=1):
                epoch_train.append((aug,label))

        # Partial train/val swap
        num_swap_train=int(len(epoch_train)*swap_fraction)
        num_swap_val=int(len(val_samples)*swap_fraction)
        swap_train_idx=random.sample(range(len(epoch_train)),num_swap_train)
        swap_val_idx=random.sample(range(len(val_samples)),num_swap_val)
        for t_idx,v_idx in zip(swap_train_idx,swap_val_idx):
            epoch_train[t_idx], val_samples[v_idx]=val_samples[v_idx], epoch_train[t_idx]

        train_loader=DataLoader(SymptomDataset(epoch_train,le,vocab),
                                batch_size=args.batch_size,shuffle=True,collate_fn=collate_batch)
        val_loader=DataLoader(SymptomDataset(val_samples,le,vocab),
                              batch_size=args.batch_size,shuffle=False,collate_fn=collate_batch)

        # Train step
        model.train()
        total_loss=0
        for x,lengths,y in train_loader:
            x,lengths,y=x.to(device),lengths.to(device),y.to(device)
            optimizer.zero_grad()
            logits=model(x,lengths)
            loss=criterion(logits,y)
            loss.backward()
            optimizer.step()
            total_loss+=loss.item()*x.size(0)
        avg_loss=total_loss/len(train_loader.dataset)

        # Validate
        val1,val5=evaluate(model,val_loader,device)
        print(f"Epoch {epoch:02d} | Train Loss: {avg_loss:.4f} | Val Top1: {val1:.4f} | Val Top5: {val5:.4f}")
        scheduler.step()

        if val1>best_val:
            best_val=val1
            wait=0
            os.makedirs(args.output_dir,exist_ok=True)
            torch.save(model.state_dict(),os.path.join(args.output_dir,"symptom_classifier.pth"))
            import pickle
            with open(os.path.join(args.output_dir,"vocab.pkl"),"wb") as f: pickle.dump(vocab,f)
            with open(os.path.join(args.output_dir,"label_encoder.pkl"),"wb") as f: pickle.dump(le,f)
            print(f"[i] Saved best model (val acc {best_val:.4f})")
        else:
            wait+=1
            if wait>=patience:
                print("[i] Early stopping triggered.")
                break

    print("[i] Training complete. Best val acc:",best_val)

# Entry
if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--data-dir",type=str,default="dataset")
    parser.add_argument("--output-dir",type=str,default="output")
    parser.add_argument("--epochs",type=int,default=8)
    parser.add_argument("--batch-size",type=int,default=16)
    parser.add_argument("--embed-dim",type=int,default=64)
    parser.add_argument("--hidden-dim",type=int,default=64)
    parser.add_argument("--lr",type=float,default=1e-3)
    parser.add_argument("--vocab-size",type=int,default=10000)
    parser.add_argument("--force-cpu",action="store_true")
    args=parser.parse_args()
    main(args)

