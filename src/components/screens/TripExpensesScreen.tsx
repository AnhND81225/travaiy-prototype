import {ExpensesScreen} from '../../features/travel/ExpensesScreen';
export function TripExpensesScreen({onBack}:{onBack:()=>void;onOpenGroupExpenses:()=>void}){return <ExpensesScreen scope="personal" onBack={onBack}/>;}
