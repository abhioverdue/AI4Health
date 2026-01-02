import { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Phone, 
  Video, 
  MapPin, 
  Calendar,
  Search,
  ChevronRight,
  Clock,
  UserCheck,
  Stethoscope,
  ArrowLeft,
  MessageSquare,
  FileText,
  Activity
} from 'lucide-react';
import { Language, Screen } from '../App';
import { useTranslate } from '../hooks/useTranslation';

interface HealthWorkerViewProps {
  language: Language;
  isOnline: boolean;
  onNavigate: (screen: Screen) => void;
}

type Tab = 'dashboard' | 'patients' | 'transit' | 'teleconsult' | 'reports';

export function HealthWorkerView({ language, isOnline, onNavigate }: HealthWorkerViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Translate key UI elements
  const dashboardLabel = useTranslate('Dashboard');
  const patientsLabel = useTranslate('Patients');
  const transitLabel = useTranslate('Transit');
  const consultsLabel = useTranslate('Consults');
  const reportsLabel = useTranslate('Reports');
  const onlineLabel = useTranslate('Online');
  const offlineLabel = useTranslate('Offline');

  // Mock data
  const stats = {
    activeCases: 12,
    pendingFollowups: 5,
    consultationsToday: 8,
    medicDispatches: 2,
  };

  const patients = [
    {
      id: 'P001',
      name: 'Ramesh Kumar',
      age: 52,
      village: 'Rampur',
      lastVisit: '2024-12-18',
      condition: 'Hypertension monitoring',
      riskLevel: 'medium' as const,
      status: 'active',
      phone: '+91 98765 43210',
    },
    {
      id: 'P002',
      name: 'Sita Devi',
      age: 35,
      village: 'Rampur',
      lastVisit: '2024-12-20',
      condition: 'Pregnancy checkup',
      riskLevel: 'low' as const,
      status: 'active',
      phone: '+91 98765 43211',
    },
    {
      id: 'P003',
      name: 'Mohan Singh',
      age: 68,
      village: 'Rampur',
      lastVisit: '2024-12-22',
      condition: 'Chest pain - urgent',
      riskLevel: 'high' as const,
      status: 'medic-dispatched',
      phone: '+91 98765 43212',
    },
  ];

  const medicTransits = [
    {
      id: 'MT001',
      patientName: 'Mohan Singh',
      medicName: 'Dr. Rajesh Kumar',
      status: 'enroute' as const,
      eta: '12 min',
      distance: '3.2 km',
      requestTime: '10:45 AM',
    },
    {
      id: 'MT002',
      patientName: 'Lakshmi Bai',
      medicName: 'Dr. Priya Sharma',
      status: 'completed' as const,
      eta: '-',
      distance: '5.1 km',
      requestTime: '09:15 AM',
    },
  ];

  const teleconsults = [
    {
      id: 'TC001',
      patientName: 'Ramesh Kumar',
      doctorName: 'Dr. Anjali Verma',
      date: '2024-12-22',
      time: '11:30 AM',
      duration: '15 min',
      status: 'completed' as const,
      notes: 'BP stable, continue medication',
    },
    {
      id: 'TC002',
      patientName: 'Sita Devi',
      doctorName: 'Dr. Suresh Patel',
      date: '2024-12-21',
      time: '03:00 PM',
      duration: '20 min',
      status: 'completed' as const,
      notes: 'Prenatal vitamins prescribed',
    },
  ];

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enroute': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 pt-12 pb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-1">Health Worker Portal</h1>
            <p className="text-sm text-white/80">स्वास्थ्य कार्यकर्ता पोर्टल</p>
            <div className="mt-2 text-sm text-white/90">ASHA Worker - Rampur Block</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-xs ${
              isOnline ? 'bg-green-400/30' : 'bg-orange-400/30'
            }`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
            <button className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="flex gap-1 -mb-px">
          {[
            { id: 'dashboard', label: dashboardLabel, icon: Activity },
            { id: 'patients', label: patientsLabel, icon: Users },
            { id: 'transit', label: transitLabel, icon: MapPin },
            { id: 'teleconsult', label: consultsLabel, icon: Video },
            { id: 'reports', label: reportsLabel, icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-8 h-8 text-white/80" />
                  <div className="text-3xl">{stats.activeCases}</div>
                </div>
                <div className="text-sm text-white/90">Active Cases</div>
                <div className="text-xs text-white/70">सक्रिय मामले</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-8 h-8 text-white/80" />
                  <div className="text-3xl">{stats.pendingFollowups}</div>
                </div>
                <div className="text-sm text-white/90">Follow-ups</div>
                <div className="text-xs text-white/70">अनुवर्ती</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Video className="w-8 h-8 text-white/80" />
                  <div className="text-3xl">{stats.consultationsToday}</div>
                </div>
                <div className="text-sm text-white/90">Consults Today</div>
                <div className="text-xs text-white/70">आज परामर्श</div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <AlertCircle className="w-8 h-8 text-white/80" />
                  <div className="text-3xl">{stats.medicDispatches}</div>
                </div>
                <div className="text-sm text-white/90">Active Dispatch</div>
                <div className="text-xs text-white/70">सक्रिय प्रेषण</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-teal-50 rounded-xl flex flex-col items-center gap-2 hover:bg-teal-100 transition-colors active:scale-[0.98]">
                  <UserCheck className="w-6 h-6 text-teal-600" />
                  <span className="text-sm text-teal-700">New Visit</span>
                </button>
                <button className="p-4 bg-purple-50 rounded-xl flex flex-col items-center gap-2 hover:bg-purple-100 transition-colors active:scale-[0.98]">
                  <Video className="w-6 h-6 text-purple-600" />
                  <span className="text-sm text-purple-700">Start Consult</span>
                </button>
                <button className="p-4 bg-orange-50 rounded-xl flex flex-col items-center gap-2 hover:bg-orange-100 transition-colors active:scale-[0.98]">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  <span className="text-sm text-orange-700">Request Medic</span>
                </button>
                <button className="p-4 bg-blue-50 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-100 transition-colors active:scale-[0.98]">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-blue-700">Daily Report</span>
                </button>
              </div>
            </div>

            {/* High Priority Patients */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">High Priority Patients</h3>
                <button 
                  onClick={() => setActiveTab('patients')}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {patients.filter(p => p.riskLevel === 'high' || p.status === 'medic-dispatched').map((patient) => (
                  <div key={patient.id} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-1">{patient.name}</h4>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                      </div>
                      {patient.status === 'medic-dispatched' && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          Medic En Route
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-red-700 transition-colors active:scale-[0.98]">
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                      <button className="px-4 bg-white border border-red-300 text-red-700 py-2 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors active:scale-[0.98]">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Patient List */}
            <div className="space-y-3">
              {patients.map((patient) => (
                <div key={patient.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-gray-800">{patient.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${getRiskColor(patient.riskLevel)}`}>
                            {patient.riskLevel}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{patient.age} yrs</span>
                          <span>•</span>
                          <span>{patient.village}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl mb-3">
                      <div className="text-xs text-gray-500 mb-1">Current Condition</div>
                      <div className="text-sm text-gray-800">{patient.condition}</div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Last visit: {patient.lastVisit}</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-purple-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors active:scale-[0.98]">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">Call</span>
                      </button>
                      <button className="flex-1 bg-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors active:scale-[0.98]">
                        <Video className="w-4 h-4" />
                        <span className="text-sm">Consult</span>
                      </button>
                      <button 
                        onClick={() => setSelectedPatient(selectedPatient === patient.id ? null : patient.id)}
                        className="px-4 bg-gray-100 text-gray-700 py-3 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-[0.98]"
                      >
                        <ChevronRight className={`w-5 h-5 transition-transform ${selectedPatient === patient.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Patient History */}
                  {selectedPatient === patient.id && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5">
                      <h4 className="text-gray-800 mb-3">Patient History</h4>
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Stethoscope className="w-4 h-4 text-teal-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">Home Visit</span>
                                <span className="text-xs text-gray-500">Dec 18, 2024</span>
                              </div>
                              <p className="text-sm text-gray-700">Blood pressure check, medication review</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Video className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">Teleconsultation</span>
                                <span className="text-xs text-gray-500">Dec 10, 2024</span>
                              </div>
                              <p className="text-sm text-gray-700">Dr. Anjali - BP stable, continue meds</p>
                            </div>
                          </div>
                        </div>

                        <button className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50 transition-colors active:scale-[0.98]">
                          View Complete History
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transit Tab */}
        {activeTab === 'transit' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-blue-800 font-medium mb-1">Track Medic Teams</div>
                  <p className="text-sm text-blue-700">
                    {language === 'hindi'
                      ? 'अपने क्षेत्र में सभी मेडिक प्रेषण देखें और ट्रैक करें'
                      : 'View and track all medic dispatches in your area'}
                  </p>
                </div>
              </div>
            </div>

            {medicTransits.map((transit) => (
              <div key={transit.id} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-800">{transit.patientName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transit.status)}`}>
                        {transit.status === 'enroute' ? 'En Route' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Medic: {transit.medicName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Requested</div>
                    <div className="text-sm text-gray-800">{transit.requestTime}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Distance</div>
                    <div className="text-sm text-gray-800">{transit.distance}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">ETA</div>
                    <div className="text-sm text-gray-800">{transit.eta}</div>
                  </div>
                </div>

                {transit.status === 'enroute' && (
                  <>
                    <div className="mb-4 h-32 bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🚑</div>
                        <div className="text-sm text-gray-600">Tracking live location</div>
                      </div>
                      <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 shadow-sm flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-700">Live</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-purple-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors active:scale-[0.98]">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">Call Medic</span>
                      </button>
                      <button className="flex-1 bg-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors active:scale-[0.98]">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">Message</span>
                      </button>
                    </div>
                  </>
                )}

                {transit.status === 'completed' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <UserCheck className="w-4 h-4" />
                      <span>Patient care completed - follow-up scheduled</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {medicTransits.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚑</div>
                <h3 className="text-gray-800 mb-2">No Active Transits</h3>
                <p className="text-gray-600">
                  {language === 'hindi'
                    ? 'कोई सक्रिय मेडिक प्रेषण नहीं'
                    : 'No active medic dispatches at the moment'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Teleconsult Tab */}
        {activeTab === 'teleconsult' && (
          <div className="space-y-4">
            {/* Start New Consult Button */}
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
              <Video className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Start New Teleconsultation</div>
                <div className="text-sm text-purple-100">नया टेलीकंसल्टेशन शुरू करें</div>
              </div>
            </button>

            {/* Available Doctors */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h3 className="text-gray-800 mb-4">Available Doctors</h3>
              <div className="space-y-3">
                {[
                  { name: 'Dr. Anjali Verma', specialty: 'General Medicine', available: true },
                  { name: 'Dr. Suresh Patel', specialty: 'Gynecology', available: true },
                  { name: 'Dr. Amit Kumar', specialty: 'Pediatrics', available: false },
                ].map((doctor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center text-white">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-800 font-medium">{doctor.name}</div>
                        <div className="text-xs text-gray-500">{doctor.specialty}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-xs text-gray-600">{doctor.available ? 'Available' : 'Busy'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation History */}
            <div>
              <h3 className="text-gray-800 mb-4">Recent Consultations</h3>
              <div className="space-y-3">
                {teleconsults.map((consult) => (
                  <div key={consult.id} className="bg-white rounded-2xl shadow-md p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-1">{consult.patientName}</h4>
                        <p className="text-sm text-gray-600">with {consult.doctorName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(consult.status)}`}>
                        {consult.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{consult.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{consult.time}</span>
                      </div>
                      <span>Duration: {consult.duration}</span>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-3">
                      <div className="text-xs text-blue-600 mb-1">Doctor's Notes:</div>
                      <p className="text-sm text-blue-800">{consult.notes}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors active:scale-[0.98]">
                        View Details
                      </button>
                      <button className="flex-1 bg-teal-500 text-white py-2 rounded-xl text-sm hover:bg-teal-600 transition-colors active:scale-[0.98]">
                        Follow-up
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Call to Doctors */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-orange-800 font-medium mb-1">Emergency Consult Line</div>
                  <div className="text-sm text-orange-700">Call: 1800-XXX-XXXX</div>
                </div>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors active:scale-[0.98]">
                  Call
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-gray-800 mb-4">This Week's Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Visits</div>
                    <div className="text-2xl text-blue-600">45</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Teleconsultations</div>
                    <div className="text-2xl text-purple-600">23</div>
                  </div>
                  <Video className="w-8 h-8 text-purple-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Medic Requests</div>
                    <div className="text-2xl text-orange-600">8</div>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', action: 'Completed teleconsult for Ramesh Kumar', icon: Video },
                  { time: '4 hours ago', action: 'Requested medic for Mohan Singh', icon: AlertCircle },
                  { time: 'Yesterday', action: 'Home visit - Sita Devi checkup', icon: UserCheck },
                  { time: '2 days ago', action: 'Updated patient records', icon: FileText },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Report Button */}
            <button className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white p-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
              <FileText className="w-5 h-5" />
              <span>Generate Monthly Report</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}