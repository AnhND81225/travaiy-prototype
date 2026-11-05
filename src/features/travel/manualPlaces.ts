import {MOCK_PLACES} from '../../data/mockData';
import {images} from './fixtures';
import type {GeoPoint} from './model';
export type ManualPlace={id:string;name:string;category:string;image:string;address:string;location?:GeoPoint;duration?:string};
// Approximate coordinates and illustrative images for offline prototype selection.
const extra:Record<string,[string,number,number,string][]>={
 'Hội An':[['Chùa Cầu',15.877,108.326,images.town],['Phố cổ Hội An',15.879,108.33,images.town],['Biển An Bàng',15.913,108.339,images.beach]],
 'Nha Trang':[['Bãi biển Trần Phú',12.238,109.198,images.beach],['Tháp Bà Ponagar',12.265,109.195,images.hero],['Chợ Đầm',12.255,109.189,images.food]],
 'Phú Quốc':[['Bãi Sao',10.055,104.035,images.beach],['Chợ đêm Phú Quốc',10.217,103.96,images.food],['Dinh Cậu',10.219,103.957,images.resort]],
 'Sapa':[['Bản Cát Cát',22.336,103.823,images.hero],['Nhà thờ đá Sapa',22.336,103.843,images.room2],['Thung lũng Mường Hoa',22.303,103.87,images.bay]],
 'Huế':[['Đại Nội Huế',16.469,107.578,images.hero],['Chùa Thiên Mụ',16.454,107.544,images.bay],['Chợ Đông Ba',16.473,107.586,images.food]],
 'Ninh Bình':[['Tràng An',20.25,105.917,images.bay],['Hang Múa',20.23,105.937,images.hero],['Tam Cốc',20.216,105.938,images.bay]],
};
export function manualPlacesFor(city:string):ManualPlace[]{
 const center:Record<string,[number,number]>={'TP.HCM':[10.7769,106.7009],'Đà Lạt':[11.943,108.445],'Hội An':[15.879,108.33],'Nha Trang':[12.24,109.19],'Phú Quốc':[10.217,103.96],'Sapa':[22.336,103.843],'Huế':[16.469,107.578],'Ninh Bình':[20.25,105.937]};
 const point=center[city];
 const additional:ManualPlace[]=point?[{id:`food-${city}`,name:`Thưởng thức ẩm thực ${city}`,category:'Ăn uống',image:images.food,address:city,location:{lat:point[0],lng:point[1]},duration:'1 giờ'},{id:`experience-${city}`,name:`Trải nghiệm địa phương ${city}`,category:'Trải nghiệm',image:city==='Đà Lạt'?images.dalatCabin:images.bay,address:city,location:{lat:point[0]+.005,lng:point[1]+.005},duration:'2 giờ'}]:[];
 const existing=MOCK_PLACES.filter(p=>p.city===city).map(p=>({id:p.id,name:p.name,category:p.category,image:p.images[0],address:p.address,location:p.coordinates?.lat!==undefined&&p.coordinates.lng!==undefined?{lat:p.coordinates.lat,lng:p.coordinates.lng}:undefined}));
 if(city==='TP.HCM')return existing;
 return [...existing,...(extra[city]||[]).map(([name,lat,lng,image],index)=>({id:`manual-${city}-${index}`,name,category:'Tham quan',image,address:city,location:{lat,lng}})),...additional];
}
