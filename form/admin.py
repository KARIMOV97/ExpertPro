from django.contrib import admin
from .models import (
    Cars,
    Materiallar,
    KuzovYechibOrnatish,
    KuzovDetailCoefficient,
    IchkiDetallarYechibOrnatish,
    IchkiDetailCoefficient,
    YechiladiganDetallarTamirlash,
    YechilmaydiganDetallarTamirlash,
    TamirlashVaqtiYechiladigan,
    TamirlashVaqtiYechilmaydigan,
    TamirlashDarajasi,
    Kuzov,
    CarModel,
)


admin.site.register(Kuzov)
admin.site.register(CarModel)
admin.site.register(KuzovYechibOrnatish)
admin.site.register(KuzovDetailCoefficient)
admin.site.register(IchkiDetallarYechibOrnatish)
admin.site.register(IchkiDetailCoefficient)
admin.site.register(YechiladiganDetallarTamirlash)
admin.site.register(YechilmaydiganDetallarTamirlash)
admin.site.register(TamirlashVaqtiYechiladigan)
admin.site.register(TamirlashVaqtiYechilmaydigan)
admin.site.register(TamirlashDarajasi)
admin.site.register(Materiallar)
admin.site.register(Cars)
