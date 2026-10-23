import {AIGeneratingScreen} from './components/wizard/AIGeneratingScreen';
import {TripMemoriesScreen,TripJourneyMapScreen} from './features/travel/TripMemoriesScreen';
import {requiredWizardStep,destinationAfterAccess,manualEditorRedirect,type ConfirmedWizardAccess,type AccessPurpose,type PlanningMode} from './features/travel/wizardFlow';
import {PlaceSelectionScreen} from './features/travel/PlaceSelectionScreen';
import {ProfileNameScreen} from './features/travel/ProfileNameScreen';
import {ManualPlanScreen} from './features/travel/ManualPlanScreen';
import {RoutePlannerScreen} from './features/travel/RoutePlannerScreen';
import {AlyAssistant} from './features/travel/AlyAssistant';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { StayListScreen, StayDetailScreen } from './features/travel/StaysScreens';
import { MemoryMapScreen } from './features/travel/MapScreens';
import { ReviewHub } from './features/travel/ReviewHub';
import { TripsScreen, DestinationScreen, AIUsageScreen, JoinGroupScreen, RecoveryScreen, ManageAccessScreen, LocalDocumentScreen } from './features/travel/FlowScreens';
import { useTravel, useStored } from './features/travel/TravelContext';
import { WizardStayScreen } from './features/travel/WizardStayScreen';
import { STAYS } from './features/travel/fixtures';
import { buildWizardPlan, wizardDateError, lodgingBudget, wizardNeedsStay } from './features/travel/wizardPlan';
import { DeviceFrame } from './components/common/DeviceFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { OnboardingStep1 } from './components/screens/OnboardingStep1';
import { OnboardingStep2 } from './components/screens/OnboardingStep2';
import { OnboardingStep3 } from './components/screens/OnboardingStep3';
import { OnboardingStep4 } from './components/screens/OnboardingStep4';
import { OnboardingComplete } from './components/screens/OnboardingComplete';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { MapViewScreen } from './components/screens/MapViewScreen';
import { PlaceDetailScreen } from './components/screens/PlaceDetailScreen';
import { SearchFilterScreen } from './components/screens/SearchFilterScreen';
import { WishlistScreen } from './components/screens/WishlistScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

// Wizard Flow Components
import { WizardStep1Destination } from './components/wizard/WizardStep1Destination';
import { WizardStep2Dates } from './components/wizard/WizardStep2Dates';
import { WizardStep3Companions } from './components/wizard/WizardStep3Companions';
import { WizardStep4Budget } from './components/wizard/WizardStep4Budget';
import { WizardStep5Preferences } from './components/wizard/WizardStep5Preferences';
import { WizardStep6Summary } from './components/wizard/WizardStep6Summary';

// Itinerary & Preparation Screens
import { TripOverviewScreen } from './components/screens/TripOverviewScreen';
import { DayItineraryScreen } from './components/screens/DayItineraryScreen';
import { ItineraryEditScreen } from './components/screens/ItineraryEditScreen';
import { TripPreparationScreen } from './components/screens/TripPreparationScreen';
import { PackingListScreen } from './components/screens/PackingListScreen';

// Live Trip & Companion Screens
import { GroupSpaceScreen } from './components/screens/GroupSpaceScreen';
import { GroupChatScreen } from './components/screens/GroupChatScreen';
import { GroupPollScreen } from './components/screens/GroupPollScreen';
import { GroupLocationScreen } from './components/screens/GroupLocationScreen';
import { GroupExpenseSplitScreen } from './components/screens/GroupExpenseSplitScreen';
import { TripExpensesScreen } from './components/screens/TripExpensesScreen';
import { PhotoboothScreen } from './components/screens/PhotoboothScreen';
import { JournalAlbumScreen } from './components/screens/JournalAlbumScreen';
import { CreateRecapScreen } from './components/screens/CreateRecapScreen';
import { TripRecapFinalScreen } from './components/screens/TripRecapFinalScreen';
import { CommunityFeedScreen } from './components/screens/CommunityFeedScreen';
import { CreatePostScreen } from './components/screens/CreatePostScreen';
import { SavedItemsScreen } from './components/screens/SavedItemsScreen';

// Documents, Subscription, AI Proposal & Adaptive Skip
import { TravelWalletScreen } from './components/screens/TravelWalletScreen';
import { AddTravelDocumentScreen } from './components/screens/AddTravelDocumentScreen';
import { TravelDocumentDetailScreen } from './components/screens/TravelDocumentDetailScreen';
import { WizardSubscriptionScreen, isPlanAvailable, type TripAccessPlan } from './components/wizard/WizardSubscriptionScreen';
import { AIItineraryProposalScreen } from './components/screens/AIItineraryProposalScreen';

import { Destination, NavTab, Place, ScreenId, TripWizardData, UserPreferences } from './types/travel';
import { INITIAL_PREFERENCES, INITIAL_WIZARD_DATA, MOCK_DESTINATIONS, MOCK_PLACES } from './data/mockData';

// Route to ScreenId mapper for DeviceFrame header & simulation drawer
const SCREEN_ROUTES: Record<ScreenId, string> = {
  'welcome': '/welcome',
  'onboarding-1': '/onboarding/step-1',
  'onboarding-2': '/onboarding/step-2',
  'onboarding-3': '/onboarding/step-3',
  'onboarding-4': '/onboarding/step-4',
  'onboarding-complete': '/onboarding/complete',
  'home': '/home',
  'explore': '/explore',
  'map': '/map',
  'place-detail': '/place/tiem-tu-lung',
  'search': '/search',
  'wishlist': '/wishlist',
  'wizard-destination': '/wizard/destination',
  'wizard-places': '/wizard/places',
  'wizard-dates': '/wizard/dates',
  'wizard-stay': '/wizard/stay',
  'wizard-companions': '/wizard/companions',
  'wizard-budget': '/wizard/budget',
  'wizard-preferences': '/wizard/preferences',
  'wizard-summary': '/wizard/summary',
  'ai-generating': '/wizard/ai-generating',
  'trip-overview': '/trip/overview',
  'day-itinerary': '/trip/day/1',
  'itinerary-edit': '/trip/edit/1',
  'trip-preparation': '/trip/preparation',
  'packing-list': '/trip/packing-list',
  'today-schedule': '/trip/day/1',
  'adaptive-schedule': '/trip/adaptive',
  'group-space': '/trip/group',
  'group-poll': '/trip/group/poll',
  'group-location': '/trip/group/location',
  'group-expense-split': '/trip/group/expense-split',
  'trip-expenses': '/trip/expenses',
  'photobooth': '/trip/camera',
  'journal-album': '/trip/journal',
  'create-recap': '/trip/recap/create',
  'trip-recap-final': '/trip/recap/final',
  'community-feed': '/community',
  'create-post': '/community/create-post',
  'saved-items': '/saved',
  'travel-wallet': '/wallet',
  'add-travel-document': '/wallet/add',
  'travel-document-detail': '/wallet/document/vj128',
  'trip-subscription': '/subscription',
  'ai-itinerary-proposal': '/wizard/ai-proposal',
  'adaptive-preview-skip': '/trip/adaptive-preview',
  'profile': '/profile',
  'stays': '/explore/stays',
  'stay-detail': '/stay/may-bien',
  'memory-map': '/trip/recap/map',
};

// Route params wrappers
function PlaceDetailWrapper({ onBack, onOpenMap, onCreatePlan }: { onBack: () => void; onOpenMap: () => void; onCreatePlan: (place: Place) => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <PlaceDetailScreen
      key={id}
      placeId={id || 'tiem-tu-lung'}
      onCreatePlan={onCreatePlan}
      onBack={()=>{const category=MOCK_PLACES.find(p=>p.id===id)?.category;const valid=['Cà phê','Biển','Núi','Check-in','Ăn uống'].includes(category||'');navigate(valid?`/explore?category=${encodeURIComponent(category!)}`:'/explore');}}
      onSelectPlace={(newId) => navigate(`/place/${newId}`)}
      onOpenMap={onOpenMap}
    />
  );
}

function DayItineraryWrapper({
  onNavigateTab,
  onOpenPlaceDetail,
  onBack,
}: {
  onNavigateTab: (tab: NavTab) => void;
  onOpenPlaceDetail: (id: string) => void;
  onBack: () => void;
}) {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const day = dayNumber ? parseInt(dayNumber, 10) : 1;
  return (
    <DayItineraryScreen
      onNavigateTab={onNavigateTab}
      initialDay={day}
      onOpenPlaceDetail={onOpenPlaceDetail}
      onEditDay={(d) => navigate(`/trip/edit/${d}`)}
      onBack={onBack}
    />
  );
}

/** Keeps old deep links working while adaptive actions now live in the selected day. */
function AdaptiveRouteRedirect() {
  const { adaptive } = useTravel();
  return <Navigate to={`/trip/day/${adaptive?.dayNumber ?? 1}`} replace />;
}

function ItineraryEditWrapper({ onBack }: { onBack: () => void }) {
  const {setPlan} = useTravel();
  const navigate = useNavigate();
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const day = dayNumber ? parseInt(dayNumber, 10) : 1;
  return <ItineraryEditScreen initialDay={day} onSave={(updatedPlan) => { setPlan(updatedPlan); navigate(`/trip/day/${day}`); }} onCancel={() => navigate(`/trip/day/${day}`)} />;
}

function NewTripEntry({onStart}:{onStart:()=>void}){const started=useRef(false);useEffect(()=>{if(!started.current){started.current=true;onStart();}},[onStart]);return null;}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userPreferences, setUserPreferences] = useStored<UserPreferences>('travaiy-user-preferences-v1', INITIAL_PREFERENCES);
  const editingTravelDNA = new URLSearchParams(location.search).get('from') === 'profile';
  const onboardingPath = (step: number) => `/onboarding/step-${step}${editingTravelDNA ? '?from=profile' : ''}`;
  const [accessPurpose,setAccessPurpose]=useStored<AccessPurpose>('travaiy-access-purpose-v1','create');
  const [confirmedAccess,setConfirmedAccess]=useStored<ConfirmedWizardAccess|null>('travaiy-confirmed-access-v1',null);
  const [wizardAccessPlan, setWizardAccessPlan] = useStored<TripAccessPlan | null>('travaiy-wizard-access-v1',null);
  const [draftId,setDraftId]=useStored<string>('travaiy-draft-id-v1',`draft-${Date.now()}`);
  const [draftPending,setDraftPending]=useStored<boolean>('travaiy-draft-pending-v1',true);
  const [generationRequestId,setGenerationRequestId]=useStored<string>('travaiy-ai-request-v1','');
  const [wizardData, setWizardData] = useStored<TripWizardData>('travaiy-wizard-data-v1',INITIAL_WIZARD_DATA);
  const {plan,setPlan,trips,accessFor,accessLimit,selectAccess,consumeAI} = useTravel();
  const wizardPlan = useMemo(() => ({...buildWizardPlan(wizardData),id:draftId}), [wizardData,draftId]);
  const approveWizardPlan = () => {if(wizardNeedsStay(wizardData)){navigate('/wizard/stay');return;}if(wizardDateError(wizardData)){navigate('/wizard/dates');return;}setPlan(wizardPlan);setDraftPending(false); navigate('/trip/overview');};
  const startNewTrip=()=>{
    const interests=userPreferences.interests.flatMap(value=>/Ăn|cà phê/i.test(value)?['Ẩm thực']:/Thiên nhiên/i.test(value)?['Thiên nhiên']:/Văn hóa/i.test(value)?['Văn hóa']:/Chụp ảnh/i.test(value)?['Chụp ảnh']:/Nghỉ dưỡng|thư giãn/i.test(value)?['Thư giãn']:[]);
    setWizardData({...INITIAL_WIZARD_DATA,planningMode:undefined,interests:[...new Set(interests)],mustVisitPlaces:[]});setDraftId(`trip-${Date.now()}`);setDraftPending(true);setWizardAccessPlan(null);setConfirmedAccess(null);setAccessPurpose('create');setGenerationRequestId('');navigate('/wizard/destination');
  };
  const startGeneration=(tier:TripAccessPlan)=>{
    const required=requiredWizardStep(wizardData);if(required){navigate(required);return;}
    const access=accessFor(draftId);if(access.used>=accessLimit(tier)){navigate('/wizard/ai-limit');return;}
    setGenerationRequestId(`request-${Date.now()}`);navigate('/wizard/ai-generating');
  };
  const continueAfterAccess=(tier:TripAccessPlan)=>{
    selectAccess(draftId,tier);
    if(accessPurpose==='upgrade'){setConfirmedAccess(null);navigate(destinationAfterAccess(wizardData.planningMode||'ai','upgrade'));return;}
    const mode=wizardData.planningMode;if(!mode){navigate('/wizard/summary');return;}
    setConfirmedAccess({tripId:draftId,mode,tier});
    if(mode==='manual')navigate(destinationAfterAccess(mode,'create'));else startGeneration(tier);
  };
  const chooseWizardAccess=(tier:TripAccessPlan)=>{
    if(accessPurpose==='create'){const required=requiredWizardStep(wizardData);if(required){navigate(required);return;}if(!wizardData.planningMode){navigate('/wizard/summary');return;}}
    if(!isPlanAvailable(tier,wizardData.companionType)){setWizardAccessPlan(null);navigate('/wizard/subscription');return;}
    setWizardAccessPlan(tier);
    continueAfterAccess(tier);
  };
  const choosePlanningMode=(mode:PlanningMode)=>{
    const required=requiredWizardStep(wizardData);if(required){navigate(required);return;}
    setWizardData(prev=>({...prev,planningMode:mode}));setConfirmedAccess(null);setAccessPurpose('create');navigate('/wizard/subscription');
  };
  const manualRedirect=manualEditorRedirect(wizardData,draftId,confirmedAccess);
  const finishGeneration=()=>{
    if(confirmedAccess?.tripId!==draftId||confirmedAccess.mode!=='ai'||wizardData.planningMode!=='ai'){navigate('/wizard/summary');return;}
    if(!consumeAI(draftId,generationRequestId)){navigate('/wizard/ai-limit');return;}
    navigate('/wizard/ai-proposal');
  };
  const upgradeCurrentTrip=()=>{
    setDraftId(plan.id);setAccessPurpose('upgrade');setConfirmedAccess(null);setWizardAccessPlan(accessFor(plan.id).tier);
    setWizardData(prev=>({...prev,planningMode:plan.planningMode||'ai',companionType:plan.companionType||(accessFor(plan.id).tier==='group'?'group':'solo'),destination:plan.destination,startDate:plan.startDate||prev.startDate,endDate:plan.endDate||prev.endDate,durationText:`${plan.days} ngày · ${Math.max(0,plan.days-1)} đêm`,stayId:plan.stayId,checkIn:plan.checkIn,checkOut:plan.checkOut}));
    navigate('/wizard/subscription');
  };
  const [userName, setUserName] = useStored<string>('travaiy-user-name-v1', 'Hoàng Nam');
  const [isSimulatorMode, setIsSimulatorMode] = useState<boolean>(true);

  // Sync current route to ScreenId for DeviceFrame simulator indicator
  const currentScreen: ScreenId = useMemo(() => {
    const pathname = location.pathname;
    if (pathname === '/' || pathname === '/welcome') return 'welcome';
    if (pathname === '/onboarding/name') return 'onboarding-1';
    if (pathname === '/trip/camera') return 'photobooth';
    if (pathname === '/trip/route') return 'map';
    if (pathname === '/trip/manual/new' || pathname === '/trip/create') return 'itinerary-edit';
    if (pathname === '/onboarding/step-1') return 'onboarding-1';
    if (pathname === '/onboarding/step-2') return 'onboarding-2';
    if (pathname === '/onboarding/step-3') return 'onboarding-3';
    if (pathname === '/onboarding/step-4') return 'onboarding-4';
    if (pathname === '/onboarding/complete') return 'onboarding-complete';
    if (pathname === '/trips') return 'trip-overview';
    if (pathname.startsWith('/destination/')) return 'explore';
    if (pathname === '/home') return 'home';
    if (pathname === '/explore/stays') return 'stays';
    if (pathname.startsWith('/stay/')) return 'stay-detail';
    if (/^\/trips\/[^/]+\/memories(?:\/map)?$/.test(pathname)) return 'journal-album';
    if (pathname === '/trip/recap/map') return 'memory-map';
    if (pathname === '/explore') return 'explore';
    if (pathname === '/map') return 'map';
    if (pathname.startsWith('/place/')) return 'place-detail';
    if (pathname === '/search') return 'search';
    if (pathname === '/wishlist') return 'wishlist';
    if (pathname === '/wizard/destination') return 'wizard-destination';
    if (pathname === '/wizard/places') return 'wizard-places';
    if (pathname === '/wizard/stay') return 'wizard-stay';
    if (pathname === '/wizard/dates') return 'wizard-dates';
    if (pathname === '/wizard/companions') return 'wizard-companions';
    if (pathname === '/wizard/budget') return 'wizard-budget';
    if (pathname === '/wizard/preferences') return 'wizard-preferences';
    if (pathname === '/wizard/summary') return 'wizard-summary';
    if (pathname === '/wizard/ai-generating') return 'ai-generating';
    if (pathname === '/wizard/ai-proposal') return 'ai-itinerary-proposal';
    if (pathname === '/trip/overview') return 'trip-overview';
    if (pathname.startsWith('/trip/day/')) return 'day-itinerary';
    if (pathname.startsWith('/trip/edit/')) return 'itinerary-edit';
    if (pathname === '/trip/preparation') return 'trip-preparation';
    if (pathname === '/trip/packing-list') return 'packing-list';
    if (pathname === '/trip/today') return 'day-itinerary';
    if (pathname === '/trip/adaptive') return 'adaptive-schedule';
    if (pathname === '/trip/adaptive-preview') return 'adaptive-preview-skip';
    if (pathname === '/trip/group') return 'group-space';
    if (pathname === '/trip/group/poll') return 'group-poll';
    if (pathname === '/trip/group/location') return 'group-location';
    if (pathname === '/trip/group/expense-split') return 'group-expense-split';
    if (pathname === '/trip/expenses') return 'trip-expenses';
    if (pathname === '/trip/photobooth') return 'photobooth';
    if (pathname === '/trip/journal') return 'journal-album';
    if (pathname === '/trip/recap/create') return 'create-recap';
    if (pathname === '/trip/recap/final') return 'trip-recap-final';
    if (pathname === '/community') return 'community-feed';
    if (pathname === '/community/create-post') return 'create-post';
    if (pathname === '/saved') return 'saved-items';
    if (pathname === '/wallet') return 'travel-wallet';
    if (pathname === '/wallet/add') return 'add-travel-document';
    if (pathname.startsWith('/wallet/document/')) return 'travel-document-detail';
    if (['/wizard/subscription','/wizard/checkout','/wizard/ai-limit'].includes(pathname)) return 'trip-subscription';
    if (pathname === '/subscription') return 'trip-subscription';
    if (pathname === '/profile') return 'profile';
    return 'home';
  }, [location.pathname]);

  // Tab navigation from bottom capsule dock
  const handleNavTab = (tab: NavTab) => {
    switch (tab) {
      case 'home':
        navigate('/home');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'create-trip':
        navigate('/trip/create');
        break;
      case 'trips':
        navigate('/trips');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/home');
    }
  };

  const handleCreatePlanFromPlace = (place: Place) => {
    if(!draftPending||wizardData.destination!==place.city){setDraftId(`trip-${Date.now()}`);setWizardAccessPlan(null);}
    setDraftPending(true);
    const destination = MOCK_DESTINATIONS.find(dest => dest.title.includes(place.city));
    setWizardData(prev => ({
      ...prev,
      destination: place.city,
      destinationTagline: destination?.tagline || '',
      destinationImage: destination?.image || place.images[0],
      stayId: prev.destination === place.city ? prev.stayId : undefined,
      checkIn: prev.destination === place.city ? prev.checkIn : undefined,
      checkOut: prev.destination === place.city ? prev.checkOut : undefined,
      stayDatesMode: prev.destination === place.city ? prev.stayDatesMode : 'trip',
      mustVisitPlaces: [...new Set([...(prev.destination === place.city ? prev.mustVisitPlaces : []), place.name])],
    }));
    navigate('/wizard/destination');
  };

  const handleSelectDestination = (dest: Destination) => navigate(`/destination/${dest.id}`);

  const handleSelectScreenFromDrawer = (screenId: ScreenId) => {
    const route = SCREEN_ROUTES[screenId];
    if (route) {
      navigate(route);
    }
  };

  return (
    <DeviceFrame
      currentScreen={currentScreen}
      onSelectScreen={handleSelectScreenFromDrawer}
      isSimulatorMode={isSimulatorMode}
      onToggleSimulatorMode={() => setIsSimulatorMode(!isSimulatorMode)}
    >
      <Routes>
        <Route path="/onboarding/name" element={<ProfileNameScreen name={userName} onBack={()=>navigate(editingTravelDNA?'/profile':'/welcome')} onSave={name=>{setUserName(name);navigate(editingTravelDNA?'/profile':'/onboarding/step-1');}}/>}/>
        <Route path="/trips/:tripId/memories/map" element={<TripJourneyMapScreen/>}/>
        <Route path="/trips/:tripId/memories" element={<TripMemoriesScreen/>}/>
        <Route path="/trip/create" element={<NewTripEntry onStart={startNewTrip}/>}/>
        <Route path="/trip/manual/new" element={manualRedirect?<Navigate to={manualRedirect} replace/>:<ManualPlanScreen key={draftId} initialTripId={draftId} onSaved={()=>{setDraftPending(false);setConfirmedAccess(null);}} initialData={wizardData} startWithPlaces draftKey={`travaiy-manual-${draftId}`} onUseAI={(draft,selection)=>{setWizardData(prev=>({...prev,planningMode:'ai',destination:draft.destination,startDate:draft.startDate||prev.startDate,endDate:draft.endDate||prev.endDate,durationText:`${draft.days} ngày ${Math.max(0,draft.days-1)} đêm`,stayId:draft.stayId,stayDatesMode:'trip',checkIn:draft.checkIn,checkOut:draft.checkOut,mustVisitPlaces:selection,companionType:draft.companionType||'solo',companionCount:draft.companionType==='group'?prev.companionCount:1}));setDraftId(draft.id);setDraftPending(true);setWizardAccessPlan(null);setAccessPurpose('create');setConfirmedAccess(null);navigate('/wizard/summary');}}/>}/>
        <Route path="/trip/route" element={<RoutePlannerScreen/>}/>
        <Route path="/trip/camera" element={<PhotoboothScreen onBack={()=>navigate('/trip/journal')} onSaveToJournal={()=>navigate('/trip/journal')}/>}/>

        <Route path="/demo-review" element={<ReviewHub/>}/>
        <Route path="/explore/stays" element={<StayListScreen wizardData={wizardData}/>}/>
        <Route path="/stay/:stayId" element={<StayDetailScreen wizardData={wizardData} onChooseForWizard={(id)=>{setWizardData(prev=>({...prev,stayId:id,accommodation:STAYS.find(s=>s.id===id)?.type||prev.accommodation}));navigate('/wizard/stay');}}/>}/>
        <Route path="/trip/recap/map" element={<MemoryMapScreen/>}/>
        <Route path="/trips" element={<TripsScreen draft={draftPending?wizardData:null} onNew={()=>navigate('/trip/create')} onManual={startNewTrip} onContinueDraft={()=>navigate('/wizard/summary')} onNavigateTab={handleNavTab}/>}/>
        <Route path="/destination/:id" element={<DestinationScreen onCreate={(name,image,tagline)=>{setWizardData({...INITIAL_WIZARD_DATA,destination:name,destinationImage:image,destinationTagline:tagline,mustVisitPlaces:[]});setDraftId(`trip-${Date.now()}`);setDraftPending(true);setWizardAccessPlan(null);setConfirmedAccess(null);setAccessPurpose('create');navigate('/wizard/destination');}}/>}/>
        <Route path="/wizard/checkout" element={<Navigate to="/wizard/subscription" replace/>}/>
        <Route path="/wizard/ai-limit" element={<AIUsageScreen tripId={draftId} onUpgrade={()=>navigate('/wizard/subscription')} onManual={()=>{const saved=trips.find(t=>t.id===draftId);if(saved){setPlan(saved);navigate('/trip/edit/1');}else{setWizardData(prev=>({...prev,planningMode:'manual'}));setAccessPurpose('create');navigate('/wizard/subscription');}}}/>}/>
        <Route path="/wallet/local/:id" element={<LocalDocumentScreen/>}/>
        <Route path="/join" element={<JoinGroupScreen/>}/>
        <Route path="/join/:code" element={<JoinGroupScreen/>}/>
        <Route path="/auth/recovery" element={<RecoveryScreen/>}/>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />

        {/* 1. Welcome Screen */}
        <Route
          path="/welcome"
          element={
            <WelcomeScreen
              onStart={() => navigate('/onboarding/name')}
              onLoginSuccess={(name) => {
                if (name) setUserName(name);
                navigate('/home');
              }}
            />
          }
        />

        {/* 2. Onboarding Step 1/4 (Sở thích) */}
        <Route
          path="/onboarding/step-1"
          element={
            <OnboardingStep1
              selectedInterests={userPreferences.interests}
              onChange={(interests) =>
                setUserPreferences((prev) => ({ ...prev, interests }))
              }
              onNext={() => navigate(onboardingPath(2))}
              onBack={() => navigate(editingTravelDNA ? '/profile' : '/welcome')}
            />
          }
        />

        {/* 3. Onboarding Step 2/4 (Phong cách) */}
        <Route
          path="/onboarding/step-2"
          element={
            <OnboardingStep2
              selectedStyle={userPreferences.travelStyle}
              onChange={(travelStyle) =>
                setUserPreferences((prev) => ({ ...prev, travelStyle }))
              }
              onNext={() => navigate(onboardingPath(3))}
              onBack={() => navigate(onboardingPath(1))}
            />
          }
        />

        {/* 4. Onboarding Step 3/4 (Ưu tiên) */}
        <Route
          path="/onboarding/step-3"
          element={
            <OnboardingStep3
              selectedPriorities={userPreferences.priorities}
              onChange={(priorities) =>
                setUserPreferences((prev) => ({ ...prev, priorities }))
              }
              onNext={() => navigate(onboardingPath(4))}
              onBack={() => navigate(onboardingPath(2))}
            />
          }
        />

        {/* 5. Onboarding Step 4/4 (Thời điểm) */}
        <Route
          path="/onboarding/step-4"
          element={
            <OnboardingStep4
              selectedTimes={userPreferences.timeOfDay}
              onChange={(timeOfDay) =>
                setUserPreferences((prev) => ({ ...prev, timeOfDay }))
              }
              onNext={() => navigate(editingTravelDNA ? '/profile' : '/onboarding/complete')}
              onBack={() => navigate(onboardingPath(3))}
            />
          }
        />

        {/* 6. Onboarding Completion Celebration */}
        <Route
          path="/onboarding/complete"
          element={
            <OnboardingComplete
              preferences={userPreferences}
              userName={userName}
              onFinish={() => navigate('/home')}
            />
          }
        />

        {/* 7. Home Screen (10_Home) */}
        <Route
          path="/home"
          element={
            <HomeScreen
              onNavigateTab={handleNavTab}
              onSelectDestination={handleSelectDestination}
              onOpenSearch={() => navigate('/search')}
              onCreateTrip={()=>navigate('/trip/create')}
              onOpenWishlist={() => navigate('/wishlist')}
              onOpenCommunity={(postId, comments) => navigate(`/community${postId ? `?post=${postId}${comments ? '&comments=1' : ''}` : ''}`)}
            />
          }
        />

        {/* 8. Explore Screen (04_Explore) */}
        <Route
          path="/explore"
          element={
            <ExploreScreen
              onNavigateTab={handleNavTab}
              onSelectDestination={handleSelectDestination}
              onOpenWishlist={() => navigate('/wishlist')}
              onOpenMap={() => navigate('/map')}
              onOpenPlaceDetail={(id) => navigate(`/place/${id}`)}
              onOpenFilter={() => navigate('/search')}
            />
          }
        />

        {/* 9. Interactive Map Screen (03_Map) */}
        <Route
          path="/map"
          element={
            <MapViewScreen
              onNavigateTab={handleNavTab}
              onOpenPlaceDetail={(id) => navigate(`/place/${id}`)}
              onBack={() => navigate('/explore')}
              onOpenFilter={() => navigate('/search')}
            />
          }
        />

        {/* 10. Place Detail Screen (03_Detail Tiệm cà phê Tú Lưng) */}
        <Route
          path="/place/:id"
          element={
            <PlaceDetailWrapper
              onCreatePlan={handleCreatePlanFromPlace}
              onBack={() => navigate('/home')}
              onOpenMap={() => navigate('/map')}
            />
          }
        />

        {/* 11. Search & Filter Screen (05_Filter & 10_Search) */}
        <Route
          path="/search"
          element={
            <SearchFilterScreen
              onNavigateTab={handleNavTab}
              onOpenPlaceDetail={(id) => navigate(`/place/${id}`)}
              onOpenMap={() => navigate('/map')}
              onBack={() => navigate('/home')}
            />
          }
        />

        {/* 12. Travel Wishlist & Collections Screen (03_Wishlist) */}
        <Route
          path="/wishlist"
          element={
            <WishlistScreen
              onNavigateTab={handleNavTab}
              onOpenPlaceDetail={(id) => navigate(`/place/${id}`)}
              onBack={() => navigate('/home')}
            />
          }
        />

        {/* 13. Wizard Step 1: Chọn điểm đến */}
        <Route
          path="/wizard/destination"
          element={
            <WizardStep1Destination
              selectedDestination={wizardData.destination}
              onSelect={(destName, tagline, img) =>
                setWizardData((prev) => ({
                  ...prev,
                  destination: destName,
                  stayId: prev.destination === destName ? prev.stayId : undefined,
                  checkIn: prev.destination === destName ? prev.checkIn : undefined,
                  checkOut: prev.destination === destName ? prev.checkOut : undefined,
                  stayDatesMode: prev.destination === destName ? prev.stayDatesMode : 'trip',
                  mustVisitPlaces: prev.destination === destName ? prev.mustVisitPlaces : [],
                  destinationTagline: tagline,
                  destinationImage: img,
                }))
              }
              onNext={() => navigate('/wizard/places')}
              onBack={() => navigate('/home')}
            />
          }
        />

        <Route path="/wizard/stay" element={<WizardStayScreen data={wizardData} onSelect={id=>setWizardData(prev=>({...prev,stayId:id,accommodation:STAYS.find(s=>s.id===id)?.type||prev.accommodation}))} onUpdate={patch=>setWizardData(prev=>({...prev,...patch}))} onNext={()=>{if(!wizardNeedsStay(wizardData))navigate('/wizard/summary');}} onBack={()=>navigate('/wizard/budget')}/>}/>

        {/* 14. Wizard Step 2: Thời gian & Ngày */}
        <Route
          path="/wizard/dates"
          element={
            <WizardStep2Dates
              startDate={wizardData.startDate}
              endDate={wizardData.endDate}
              durationText={wizardData.durationText}
              departureTime={wizardData.departureTime}
              returnTime={wizardData.returnTime}
              stayId={wizardData.stayId}
              stayDatesMode={wizardData.stayDatesMode}
              checkIn={wizardData.checkIn}
              checkOut={wizardData.checkOut}
              onChange={(dates) => setWizardData((prev) => ({ ...prev, ...dates }))}
              onNext={() => navigate('/wizard/companions')}
              onBack={() => navigate('/wizard/places')}
            />
          }
        />

        {/* 15. Wizard Step 3: Người đồng hành */}
        <Route
          path="/wizard/companions"
          element={
            <WizardStep3Companions
              companionType={wizardData.companionType}
              companionCount={wizardData.companionCount}
              inviteCode={wizardData.inviteCode}
              onChange={(comp) => {
                setWizardData((prev) => ({ ...prev, ...comp }));
                if (!isPlanAvailable(wizardAccessPlan, comp.companionType)) setWizardAccessPlan(null);
              }}
              onNext={() => navigate('/wizard/budget')}
              onBack={() => navigate('/wizard/dates')}
            />
          }
        />

        {/* 16. Wizard Step 4: Ngân sách */}
        <Route
          path="/wizard/budget"
          element={
            <WizardStep4Budget
              budgetTier={wizardData.budgetTier}
              budgetAmount={wizardData.budgetAmount}
              hotelBudgetPerNight={lodgingBudget(wizardData).nightly}
              roomCount={lodgingBudget(wizardData).rooms}
              nights={lodgingBudget(wizardData).nights}
              onHotelBudgetChange={value=>setWizardData(prev=>({...prev,hotelBudgetPerNight:value}))}
              onRoomsChange={value=>setWizardData(prev=>({...prev,stayRoomCount:value}))}
              onChange={(budget) => setWizardData((prev) => ({ ...prev, ...budget }))}
              onNext={() => navigate('/wizard/stay')}
              onBack={() => navigate('/wizard/companions')}
            />
          }
        />

        {/* 17. Wizard Step 5: Sở thích & Phương tiện */}
        <Route
          path="/wizard/preferences"
          element={
            <WizardStep5Preferences
              interests={wizardData.interests}
              transport={wizardData.transport}
              accommodation={wizardData.accommodation}
              selectedStayName={STAYS.find(s=>s.id===wizardData.stayId)?.name}
              onEditStay={()=>navigate('/wizard/stay')}
              mustVisitPlaces={wizardData.mustVisitPlaces}
              notes={wizardData.notes}
              onChange={(prefs) => setWizardData((prev) => ({ ...prev, ...prefs }))}
              onNext={() => navigate('/wizard/summary')}
              onBack={() => navigate('/wizard/summary')}
            />
          }
        />

        <Route path="/wizard/places" element={<PlaceSelectionScreen city={wizardData.destination} selected={wizardData.mustVisitPlaces} onChange={names=>setWizardData(prev=>({...prev,mustVisitPlaces:names}))} deferScheduling onBack={()=>navigate('/wizard/destination')} onContinue={()=>navigate('/wizard/dates')} onAI={()=>navigate('/wizard/dates')} onManual={()=>navigate('/wizard/dates')}/>}/>

        {/* 18. Wizard Step 6: Xác nhận thông tin */}
        <Route
          path="/wizard/summary"
          element={
            <WizardStep6Summary
              data={wizardData}
              onChooseMode={choosePlanningMode}
              onEditStep={(stepNum) => {
                switch (stepNum) {
                  case 6:
                    navigate('/wizard/places');
                    break;
                  case 7:
                    navigate('/wizard/stay');
                    break;
                  case 1:
                    navigate('/wizard/destination');
                    break;
                  case 2:
                    navigate('/wizard/dates');
                    break;
                  case 3:
                    navigate('/wizard/companions');
                    break;
                  case 4:
                    navigate('/wizard/budget');
                    break;
                  case 5:
                    navigate('/wizard/preferences');
                    break;
                  default:
                    break;
                }
              }}
              onBack={() => navigate('/wizard/stay')}
            />
          }
        />

        <Route path="/wizard/subscription" element={<WizardSubscriptionScreen key={`${draftId}:${wizardData.planningMode}:${accessPurpose}`}
          planningMode={wizardData.planningMode||'ai'}
          purpose={accessPurpose}
          destination={wizardData.destination}
          duration={wizardData.durationText}
          initialPlan={wizardAccessPlan}
          companionType={wizardData.companionType}
          onBack={() => navigate(accessPurpose==='upgrade'?'/subscription':'/wizard/summary')}
          onContinue={chooseWizardAccess}
          used={accessFor(draftId).used}
        />} />

        {/* 19. AI Generating Screen */}
        <Route
          path="/wizard/ai-generating"
          element={
            <AIGeneratingScreen
              key={generationRequestId}
              onComplete={finishGeneration}
              onCancel={() => navigate('/wizard/summary')}
            />
          }
        />

        {/* 20. Trip Overview Screen (Image 17/18) */}
        <Route
          path="/trip/overview"
          element={
            <TripOverviewScreen
              onNavigateTab={handleNavTab}
              tripData={{...wizardData,destination:plan.destination,startDate:plan.startDate||wizardData.startDate,endDate:plan.endDate||wizardData.endDate}}
              onOpenDay={(dayNumber) => navigate(`/trip/day/${dayNumber}`)}
              onEditTrip={() => navigate('/trip/edit/1')}
              onOpenPreparation={() => navigate('/trip/preparation')}
              onOpenPackingList={() => navigate('/trip/packing-list')}
              onOpenTodaySchedule={() => navigate('/trip/day/1')}
              onOpenGroupSpace={() => navigate('/trip/group')}
              onOpenExpenses={() => navigate('/trip/expenses')}
              onOpenJournal={() => navigate('/trip/journal')}
              onOpenTravelWallet={() => navigate('/wallet')}
              onOpenSubscription={() => navigate('/subscription')}
              onBack={() => navigate('/home')}
            />
          }
        />

        {/* 21. Day Itinerary Screen (Image 19/20) */}
        <Route
          path="/trip/day/:dayNumber"
          element={
            <DayItineraryWrapper
              onNavigateTab={handleNavTab}
              onOpenPlaceDetail={(id) => navigate(`/place/${id}`)}
              onBack={() => navigate('/trip/overview')}
            />
          }
        />
        <Route path="/trip/day" element={<Navigate to="/trip/day/1" replace />} />

        {/* 22. Itinerary Edit Screen (Image 21/22) */}
        <Route
          path="/trip/edit/:dayNumber"
          element={<ItineraryEditWrapper onBack={() => navigate('/trip/day/1')} />}
        />

        {/* 23. Trip Preparation Screen (Image 23/24) */}
        <Route
          path="/trip/preparation"
          element={
            <TripPreparationScreen
              onNavigateTab={handleNavTab}
              onOpenPackingList={() => navigate('/trip/packing-list')}
              onBack={() => navigate('/trip/overview')}
            />
          }
        />

        {/* 24. Packing List Screen (Image 25/26/27) */}
        <Route
          path="/trip/packing-list"
          element={
            <PackingListScreen
              onNavigateTab={handleNavTab}
              onBack={() => navigate('/trip/preparation')}
            />
          }
        />

        <Route path="/trip/today" element={<Navigate to="/trip/day/1" replace />} />

        <Route path="/trip/adaptive" element={<AdaptiveRouteRedirect />} />

        {/* 27. Group Space Screen (Image 21/22) */}
        <Route
          path="/trip/group"
          element={
            <GroupSpaceScreen
              onBack={() => navigate('/trip/overview')}
              onOpenPoll={() => navigate('/trip/group/poll')}
              onOpenChat={() => navigate('/trip/group/chat')}
              onOpenLocation={() => navigate('/trip/group/location')}
              onOpenExpenseSplit={() => navigate('/trip/group/expense-split')}
              onOpenSchedule={() => navigate('/trip/day/1')}
            />
          }
        />

        <Route path="/trip/group/chat" element={<GroupChatScreen onBack={() => navigate('/trip/group')} />} />

        {/* 28. Group Poll Screen (Image 21/22) */}
        <Route
          path="/trip/group/poll"
          element={<GroupPollScreen onBack={() => navigate('/trip/group')} />}
        />

        {/* 29. Group Location & Radar Screen (Image 21/22) */}
        <Route
          path="/trip/group/location"
          element={<GroupLocationScreen onBack={() => navigate('/trip/group')} />}
        />

        {/* 30. Group Expense Split Screen (Image 23/24) */}
        <Route
          path="/trip/group/expense-split"
          element={<GroupExpenseSplitScreen onBack={() => navigate('/trip/expenses')} />}
        />

        {/* 31. Trip Expenses & Budget Management Screen (Image 23/24) */}
        <Route
          path="/trip/expenses"
          element={
            <TripExpensesScreen
              onBack={() => navigate('/trip/overview')}
              onOpenGroupExpenses={() => navigate('/trip/group/expense-split')}
            />
          }
        />

        {/* 32. Photobooth Screen (Image 25/26) */}
        <Route path="/trip/photobooth" element={<Navigate to="/trip/camera" replace />} />

        {/* 33. Journal & Trip Album Screen (Image 29/30) */}
        <Route
          path="/trip/journal"
          element={
            <JournalAlbumScreen
              onNavigateTab={handleNavTab}
              onBack={() => navigate('/trip/overview')}
              onOpenPhotobooth={() => navigate('/trip/camera')}
              onOpenCreateRecap={() => navigate('/trip/recap/create')}
            />
          }
        />

        {/* 34. Create Recap Screen (Step 2/3 - Image 27/28) */}
        <Route
          path="/trip/recap/create"
          element={
            <CreateRecapScreen
              onBack={() => navigate('/trip/journal')}
              onNext={() => navigate('/trip/recap/final')}
            />
          }
        />

        {/* 35. AI Story Recap Final Screen (Step 3/3 - Image 28) */}
        <Route
          path="/trip/recap/final"
          element={
            <TripRecapFinalScreen
              onBack={() => navigate('/trip/recap/create')}
              onFinish={() => navigate('/trip/journal')}
              onShareToCommunity={() => navigate('/community')}
            />
          }
        />

        {/* 36. Community Feed Screen (TravAIy Feed - Image 29/30) */}
        <Route
          path="/community"
          element={
            <CommunityFeedScreen
              onNavigateTab={handleNavTab}
              onCreatePost={() => navigate('/community/create-post')}
            />
          }
        />

        {/* 37. Create Post Screen (Image 29/30) */}
        <Route
          path="/community/create-post"
          element={
            <CreatePostScreen
              onBack={() => navigate('/community')}
              onPostSuccess={() => navigate('/community')}
            />
          }
        />

        {/* 38. Saved Items & Collections Screen (Image 29/30) */}
        <Route
          path="/saved"
          element={
            <SavedItemsScreen
              onBack={() => navigate('/profile')}
              onNavigateTab={handleNavTab}
              onOpenPlaceDetail={(id) => navigate(`/place/${id}`)}
            />
          }
        />

        {/* 39. Travel Wallet Screen (60_TravelWallet) */}
        <Route
          path="/wallet"
          element={
            <TravelWalletScreen
              onBack={() => navigate('/trip/overview')}
              onOpenDocumentDetail={() => navigate('/wallet/document/vj128')}
              onOpenAddDocument={() => navigate('/wallet/add')}
            />
          }
        />

        {/* 40. Add Travel Document Screen (61_AddDocument) */}
        <Route
          path="/wallet/add"
          element={
            <AddTravelDocumentScreen
              onBack={() => navigate('/wallet')}
              onSaveSuccess={() => navigate('/wallet')}
            />
          }
        />

        {/* 41. Travel Document Detail / Boarding Pass Screen (62_Detail) */}
        <Route
          path="/wallet/document/:id"
          element={
            <TravelDocumentDetailScreen
              onBack={() => navigate('/wallet')}
              onDeleteSuccess={() => navigate('/wallet')}
            />
          }
        />

        {/* 42. Trip Subscription Screen (50_Subscription) */}
        <Route
          path="/subscription"
          element={
            <ManageAccessScreen
              onUpgrade={upgradeCurrentTrip}
            />
          }
        />

        {/* 43. AI Itinerary Proposal Draft Screen */}
        <Route
          path="/wizard/ai-proposal"
          element={
            <AIItineraryProposalScreen
              draft={wizardPlan}
              onBack={() => navigate('/wizard/summary')}
              onApprove={approveWizardPlan}
              onAdjust={() => {setPlan(wizardPlan);setDraftPending(false);navigate('/trip/edit/1');}}
              onRegenerate={() => navigate('/wizard/subscription')}
              remaining={Math.max(0,accessLimit(accessFor(draftId).tier)-accessFor(draftId).used)}
            />
          }
        />

        <Route path="/trip/adaptive-preview" element={<AdaptiveRouteRedirect />} />

        {/* 45. User Profile & Travel DNA Settings */}
        <Route
          path="/profile"
          element={
            <ProfileScreen
              userName={userName}
              preferences={userPreferences}
              onNavigateTab={handleNavTab}
              onEditPreferences={() => navigate('/onboarding/step-1?from=profile')}
              onEditName={() => navigate('/onboarding/name?from=profile')}
              onLogout={() => {
                setUserName('Khách');
                navigate('/welcome');
              }}
              onOpenWishlist={() => navigate('/wishlist')}
              onOpenSavedItems={() => navigate('/saved')}
              onOpenCommunityFeed={() => navigate('/community')}
              isSimulatorMode={isSimulatorMode}
              onToggleSimulatorMode={() => setIsSimulatorMode(!isSimulatorMode)}
            />
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <AlyAssistant/>
    </DeviceFrame>
  );
}
