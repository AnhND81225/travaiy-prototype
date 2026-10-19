import React from 'react';
import { Clock, Star, MapPin } from 'lucide-react';
import { TripDayItem } from '../../types/travel';

export interface TimelineItineraryProps {
  items: TripDayItem[];
  onPlaceClick?: (placeId: string) => void;
}

export const TimelineItinerary: React.FC<TimelineItineraryProps> = ({
  items,
  onPlaceClick,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-slate-400 font-sans">
        Chưa có địa điểm nào trong lộ trình.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:top-4 before:bottom-4 before:left-[9px] before:w-0.5 before:bg-[#93B2F8]/40 text-left">
      {items.map((item) => {
        const handleClick = () => {
          if (onPlaceClick) {
            onPlaceClick(item.id);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        };

        return (
          <div key={item.id} className="relative group">
            {/* Timeline Dot with #0A1680 brand border */}
            <div
              className="absolute -left-[21px] top-4 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-[#0A1680] shadow-2xs z-10"
              aria-hidden="true"
            />

            {/* Timeline Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-[#0A1680]/30 active:scale-[0.98] transition-all cursor-pointer select-none"
            >
              {/* Header: Time, Category Badge, Duration */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Time Badge */}
                  <span className="px-2 py-0.5 rounded-lg bg-[#0A1680]/10 text-[#0A1680] font-heading font-bold text-[12px] tracking-tight">
                    {item.time}
                  </span>

                  {/* Category Badge */}
                  {item.category && (
                    <span className="px-2 py-0.5 rounded-lg bg-[#FBEDB0]/70 text-[#191C1E] font-heading font-semibold text-[11px]">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Duration */}
                {item.duration && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
                    <span>{item.duration}</span>
                  </span>
                )}
              </div>

              {/* Main Content: Thumbnail & Details */}
              <div className="flex gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.placeName}
                    className="w-18 h-18 rounded-xl object-cover shrink-0 border border-slate-100"
                    loading="lazy"
                  />
                )}

                <div className="flex-1 min-w-0">
                  {/* Place Name */}
                  <h4 className="font-heading font-bold text-[14px] text-slate-900 group-hover:text-[#0A1680] transition-colors truncate">
                    {item.placeName}
                  </h4>

                  {/* Rating, Reviews & Cost */}
                  {(item.rating || item.cost) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                      {item.rating && (
                        <span className="inline-flex items-center gap-0.5 font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                          <span>{item.rating}</span>
                          {item.reviewsCount && (
                            <span className="text-slate-400 font-normal">({item.reviewsCount})</span>
                          )}
                        </span>
                      )}

                      {item.rating && item.cost && (
                        <span className="text-slate-300">•</span>
                      )}

                      {item.cost && (
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                          {item.cost}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Note / Tip */}
                  {item.note && (
                    <p className="text-[12px] text-slate-600 font-sans mt-1.5 line-clamp-2 leading-relaxed flex items-start gap-1">
                      <span className="text-amber-500 shrink-0 text-[11px]">✦</span>
                      <span>{item.note}</span>
                    </p>
                  )}

                  {/* Address if available */}
                  {item.address && (
                    <p className="text-[11px] text-slate-400 mt-1 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" aria-hidden="true" />
                      <span>{item.address}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
