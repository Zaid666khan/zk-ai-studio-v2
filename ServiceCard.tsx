import { Check, Star, Crown, Tag } from 'lucide-react';
import type { Service } from '@/lib/types';
import { effectivePrice, formatPrice } from '@/lib/whatsapp';
import { Link } from '@/lib/router';

export function ServiceCard({ service }: { service: Service }) {
  const price = effectivePrice(service);
  const hasDiscount =
    (service.sale_price && service.sale_price > 0) ||
    (service.discount_percentage && service.discount_percentage > 0);

  return (
    <div className="glass card-hover relative overflow-hidden group flex flex-col">
      {(service.featured || service.best_seller) && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {service.best_seller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Crown className="h-3 w-3" /> Best Seller
            </span>
          )}
          {service.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Star className="h-3 w-3" /> Featured
            </span>
          )}
        </div>
      )}

      <div className="aspect-[16/10] overflow-hidden bg-ink-800">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="h-full w-full bg-grid-emerald bg-[size:24px_24px] grid place-items-center">
            <Tag className="h-10 w-10 text-emerald-700/60" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {service.category && (
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400/80 mb-2">
            {service.category}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-white mb-2">
          {service.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">
          {service.description}
        </p>

        <div className="flex items-end justify-between mb-5">
          <div>
            {hasDiscount && (
              <span className="text-xs text-gray-500 line-through mr-2">
                {formatPrice(service.price, service.currency)}
              </span>
            )}
            <span className="text-2xl font-bold text-emerald-300">
              {formatPrice(price, service.currency)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/order?service=${encodeURIComponent(service.title)}`}
            className="btn-primary flex-1 text-sm"
          >
            <Check className="h-4 w-4" /> Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
