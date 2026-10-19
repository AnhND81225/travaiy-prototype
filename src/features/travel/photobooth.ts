export type Shot = { src: string; zoom: number; x: number; y: number };
export const BOOTH_FRAMES = [
 {id:'sea',name:'Biển xanh',background:'#102C68',accent:'#F1B94C',ink:'#FFFFFF',caption:'Chạm vào mùa hè'},
 {id:'pine',name:'Đồi thông',background:'#F3EBDD',accent:'#856537',ink:'#233E35',caption:'Một ngày thật xanh'},
 {id:'film',name:'Dải kỷ niệm',background:'#0A1680',accent:'#F1B94C',ink:'#FFFFFF',caption:'Những ngày bên nhau'},
] as const;
export const PHOTO_SLOTS=[{x:42,y:110,w:676,h:390},{x:42,y:524,w:326,h:310},{x:392,y:524,w:326,h:310}];
export function coverCrop(width:number,height:number,targetWidth:number,targetHeight:number,shot:Pick<Shot,'zoom'|'x'|'y'>){
 const scale=Math.max(targetWidth/width,targetHeight/height)*Math.max(1,shot.zoom);
 const sw=targetWidth/scale,sh=targetHeight/scale;
 return {sx:Math.max(0,width-sw)*Math.min(1,Math.max(0,shot.x)),sy:Math.max(0,height-sh)*Math.min(1,Math.max(0,shot.y)),sw,sh};
}
export async function composeBooth(shots:(Shot|null)[],frameId:string,place:string,date:string){
 const frame=BOOTH_FRAMES.find(f=>f.id===frameId)||BOOTH_FRAMES[0];
 const canvas=document.createElement('canvas');canvas.width=760;canvas.height=1060;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Trình duyệt chưa hỗ trợ tạo ảnh.');
 ctx.fillStyle=frame.background;ctx.fillRect(0,0,760,1060);
 ctx.strokeStyle=frame.accent;ctx.lineWidth=2;ctx.strokeRect(18,18,724,1024);
 ctx.fillStyle=frame.ink;ctx.font='600 22px sans-serif';ctx.fillText('TRAVAIY · PHOTOBOOTH',42,65);
 ctx.textAlign='right';ctx.font='18px sans-serif';ctx.fillText(date,718,65);ctx.textAlign='left';
 for(let i=0;i<PHOTO_SLOTS.length;i++){
  const slot=PHOTO_SLOTS[i],shot=shots[i];ctx.save();ctx.translate(slot.x+slot.w/2,slot.y+slot.h/2);ctx.rotate((i===1?-2:i===2?2:0)*Math.PI/180);
  ctx.fillStyle='#FFFFFF';ctx.fillRect(-slot.w/2-7,-slot.h/2-7,slot.w+14,slot.h+14);
  if(shot){const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Không đọc được ảnh. Hãy chọn lại ảnh này.'));image.src=shot.src;});const crop=coverCrop(img.naturalWidth,img.naturalHeight,slot.w,slot.h,shot);ctx.drawImage(img,crop.sx,crop.sy,crop.sw,crop.sh,-slot.w/2,-slot.h/2,slot.w,slot.h);}
  else{ctx.fillStyle='#E8EEFB';ctx.fillRect(-slot.w/2,-slot.h/2,slot.w,slot.h);ctx.fillStyle='#0A1680';ctx.font='600 30px sans-serif';ctx.textAlign='center';ctx.fillText(`Ảnh ${i+1}`,0,0);ctx.font='20px sans-serif';ctx.fillText('Chụp hoặc chọn ảnh',0,36);ctx.textAlign='left';}ctx.restore();
 }
 ctx.fillStyle=frame.accent;ctx.font='36px serif';ctx.fillText('✦',670,910);ctx.font='italic 36px serif';ctx.fillText(frame.caption,42,912);
 ctx.fillStyle=frame.ink;ctx.font='bold 29px sans-serif';let title=place;while(ctx.measureText(title).width>630&&title.length>1)title=title.slice(0,-1);ctx.fillText(title===place?title:title+'…',42,968);
 ctx.font='18px sans-serif';ctx.fillText('Một địa điểm · Ba khoảnh khắc',42,1005);
 return canvas.toDataURL('image/jpeg',0.92);
}
