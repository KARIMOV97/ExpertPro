from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from form.admin_site import admin_site
from .views import ( 
    employees,
    generate_word, 
    save_car,
    CarModelViewSet,
    KuzovViewSet,
    ExpertViewSet,
    CarsViewSet,
    KuzovYechibOrnatishViewSet,
    KuzovDetailCoefficientViewSet,
    IchkiDetailCoefficientViewSet,
    IchkiDetallarYechibOrnatishViewSet,
    YechiladiganDetallarTamirlashViewSet,
    YechilmaydiganDetallarTamirlashViewSet,
    TamirlashVaqtiYechiladiganViewSet,
    TamirlashVaqtiYechilmaydiganViewSet,
    MateriallarViewSet,
    TamirlashDarajasiViewSet, 
    KuzovGeometrikMurakkablikViewSet,
    KuzovGeometrikMurakkablikCoefficientiViewSet,
    AlmashtiriladiganUTCViewSet,
    TamirlashYechilmaydiganUTCViewSet,
    TamirlashYechiladiganUTCViewSet,
    KuzovTuriYemirilishViewSet,
    TanlanganDetalViewSet,
    BoyoqlashVaqtiYechiladiganlarViewSet,
    BoyoqlashVaqtiYechilmaydiganlarViewSet,
    SilliqlashVaqtiYechiladiganlarViewSet,
    SilliqlashVaqtiYechilmaydiganlarViewSet,
    ShablonViewSet,
)

app_name = "form"

router = DefaultRouter()
router.register(r'car-models', CarModelViewSet)
router.register(r'kuzov', KuzovViewSet)
router.register(r'expert', ExpertViewSet)
router.register(r'cars', CarsViewSet)
router.register(r'kuzov-detail-coefficient', KuzovDetailCoefficientViewSet)
router.register(r'kuzov-yechib-ornatish', KuzovYechibOrnatishViewSet)
router.register(r'ichki-detail-coefficient', IchkiDetailCoefficientViewSet)
router.register(r'ichki-detallar-yechib-ornatish', IchkiDetallarYechibOrnatishViewSet)
router.register(r'yechiladigan-detallar-tamirlash', YechiladiganDetallarTamirlashViewSet)
router.register(r'yechilmaydigan-detallar-tamir', YechilmaydiganDetallarTamirlashViewSet)
router.register(r'tamirlash-vaqti-yechiladigan', TamirlashVaqtiYechiladiganViewSet)
router.register(r'tamirlash-vaqti-yechilmaydigan', TamirlashVaqtiYechilmaydiganViewSet)
router.register(r'materiallar', MateriallarViewSet)
router.register(r'tamirlash-darajasi', TamirlashDarajasiViewSet)
router.register(r'kuzov-geometrik-murakkablik', KuzovGeometrikMurakkablikViewSet)
router.register(r'kuzov-geometrik-murakkablik-coefitsienti', KuzovGeometrikMurakkablikCoefficientiViewSet)
router.register(r'almashtiriladigan-UTC', AlmashtiriladiganUTCViewSet)
router.register(r"tamirlash-yechilmaydigan-utc", TamirlashYechilmaydiganUTCViewSet)
router.register(r'kuzov-turi-yemirilish', KuzovTuriYemirilishViewSet)
router.register(r'tanlangan-detal', TanlanganDetalViewSet)
router.register(r'boyoqlash-yechiladigan', BoyoqlashVaqtiYechiladiganlarViewSet)
router.register(r'boyoqlash-yechilmaydigan', BoyoqlashVaqtiYechilmaydiganlarViewSet)
router.register(r'silliqlash-yechiladigan', SilliqlashVaqtiYechiladiganlarViewSet)
router.register(r'silliqlash-yechilmaydigan', SilliqlashVaqtiYechilmaydiganlarViewSet)
router.register(r"tamirlash-yechiladigan-utc", TamirlashYechiladiganUTCViewSet)
router.register(r'shablonlar', ShablonViewSet)


urlpatterns = [
      # ✅ Word generate qilish uchun URL
    path("generate-word/", generate_word, name="generate_word"),
    path('save-car/', save_car, name='save_car'),
    path('api/', include(router.urls)),
    path('', employees, name="employees"),
    path("admin/", admin_site.urls),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
