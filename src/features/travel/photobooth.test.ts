import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coverCrop, PHOTO_SLOTS } from './photobooth';
test('all collage slots fit within output without overlapping',()=>{
 for(const s of PHOTO_SLOTS){assert.ok(s.x>=0&&s.y>=0&&s.x+s.w<=760&&s.y+s.h<=1060);}
 for(let i=0;i<PHOTO_SLOTS.length;i++)for(let j=i+1;j<PHOTO_SLOTS.length;j++){const a=PHOTO_SLOTS[i],b=PHOTO_SLOTS[j];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);}
});
test('crop covers landscape and portrait slots, zoom and pan stay within source',()=>{
 for(const [w,h] of [[1600,900],[900,1600]])for(const s of PHOTO_SLOTS)for(const zoom of [1,2.5])for(const x of [0,.5,1])for(const y of [0,.5,1]){
  const c=coverCrop(w,h,s.w,s.h,{zoom,x,y});assert.ok(c.sx>=0&&c.sy>=0&&c.sx+c.sw<=w+.001&&c.sy+c.sh<=h+.001);assert.ok(Math.abs(c.sw/c.sh-s.w/s.h)<.00001);
 }
});
