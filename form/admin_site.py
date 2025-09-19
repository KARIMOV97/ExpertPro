# form/admin_site.py
from django.contrib.admin import AdminSite
from . import models
from django.contrib import admin
 
class MyAdminSite(AdminSite):
    site_header = "Expert Admin Panel"
    site_title = "Expert Admin"
    index_title = "Barcha modelllar"

    def get_app_list(self, request):
        app_list = super().get_app_list(request)

        # Model nomlarini tartib bilan chiqarish
        ordering = [
            "Cars",
            "Materiallar",
            "Kuzov Yechib Ornatish",
            "Kuzov Detail Coefficient",
            "Ichki Detallar Yechib Ornatish",
            "Ichki Detail Coefficient",
            "Tamirlash Darajasi",
            "Yechiladigan Detallar Tamirlash",
            "Tamirlash Vaqti Yechiladigan",
            "Yechilmaydigan Detallar Tamirlash",
            "Tamirlash Vaqti Yechilmaydigan",
            "Kuzov",
            "Expert",
            "Car Model",
            "Boyoqlash Coefficient",
            "Kuzov Geometrik Murakkablik"
            "Kuzov Geometrik Murakkablik Coefficienti"
            "Almashtiriladigan UTC"
            "Tamirlash Yechilmaydigan UTC"
            "Tamirlash Yechiladigan UTC"
            "Tanlangan Detal"
            'Boyoqlash Vaqti Yechiladigan',
            'Boyoqlash Vaqti Yechilmaydigan',
            'Silliqlash Vaqti Yechiladigan',
            'Silliqlash Vaqti Yechilmaydigan',
            'Shablon'
            
        ]

        for app in app_list:
            app["models"].sort(
                key=lambda x: ordering.index(x["name"])
                if x["name"] in ordering
                else len(ordering)
            )
        return app_list


# Custom admin site yaratish
admin_site = MyAdminSite(name="myadmin")

# Barcha modellarni custom admin sitega qo‘shish
admin_site.register(models.Kuzov)
admin_site.register(models.Expert)
admin_site.register(models.CarModel)
admin_site.register(models.KuzovYechibOrnatish)
admin_site.register(models.KuzovDetailCoefficient)
admin_site.register(models.IchkiDetallarYechibOrnatish)
admin_site.register(models.IchkiDetailCoefficient)
admin_site.register(models.TamirlashDarajasi)
admin_site.register(models.YechiladiganDetallarTamirlash)
admin_site.register(models.TamirlashVaqtiYechiladigan)
admin_site.register(models.YechilmaydiganDetallarTamirlash)
admin_site.register(models.TamirlashVaqtiYechilmaydigan)
admin_site.register(models.Materiallar)
admin_site.register(models.Cars)
admin_site.register(models.KuzovGeometrikMurakkablik)
admin_site.register(models.KuzovGeometrikMurakkablikCoefficienti)
admin_site.register(models.AlmashtiriladiganUTC)
admin_site.register(models.TamirlashYechilmaydiganUTC)
admin_site.register(models.TamirlashYechiladiganUTC)
admin_site.register(models.KuzovTuriYemirilish)
admin_site.register(models.TanlanganDetal)
admin_site.register(models.BoyoqlashVaqtiYechiladiganlar)
admin_site.register(models.BoyoqlashVaqtiYechilmaydiganlar)
admin_site.register(models.SilliqlashVaqtiYechiladiganlar)
admin_site.register(models.SilliqlashVaqtiYechilmaydiganlar)
admin_site.register(models.Shablon)