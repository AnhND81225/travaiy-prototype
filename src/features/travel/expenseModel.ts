export const EXPENSE_MEMBERS = [
  { id: 'you', name: 'Bạn', color: '#0A1680' },
  { id: 'minhanh', name: 'Minh Anh', color: '#547db6' },
  { id: 'linhchi', name: 'Linh Chi', color: '#b57248' },
  { id: 'quanghuy', name: 'Quang Huy', color: '#3a8a78' },
];
export type Expense = { id:string; tripId:string; scope:'personal'|'group'; title:string; amount:number; category:string; payerId:string; participantIds:string[]; createdAt:string; isSample?:boolean };
export function splitEqually(amount:number, participantIds:string[]):Record<string,number>{
 const ids=[...new Set(participantIds)];
 if(!Number.isSafeInteger(amount)||amount<=0||!ids.length)throw new Error('Nhập số tiền nguyên dương và chọn ít nhất một người.');
 const base=Math.floor(amount/ids.length),remainder=amount%ids.length;
 return Object.fromEntries(ids.map((id,index)=>[id,base+(index<remainder?1:0)]));
}
export function expenseBalances(expenses:Expense[]){
 const balances:Record<string,number>={};
 for(const expense of expenses){
  balances[expense.payerId]=(balances[expense.payerId]||0)+expense.amount;
  for(const [id,share] of Object.entries(splitEqually(expense.amount,expense.participantIds)))balances[id]=(balances[id]||0)-share;
 }
 return balances;
}
