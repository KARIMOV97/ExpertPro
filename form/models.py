from django.db import models
import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
# Kuzov
class Kuzov(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Kuzov"
        verbose_name_plural = "Kuzovlar"

    def __str__(self):
        return self.name
    
# Expert
class Expert(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Expert"
        verbose_name_plural = "Expertlar"

    def __str__(self):
        return self.name

# Car Model
class CarModel(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Car Model"
        verbose_name_plural = "Car Modellar"

    def __str__(self):
        return self.name


# Kuzov Yechib Ornatish
class KuzovYechibOrnatish(models.Model):
    img = models.ImageField(upload_to="kuzov/")
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Kuzov Yechib Ornatish"
        verbose_name_plural = "Kuzov Yechib Ornatishlar"

    def __str__(self):
        return f"{self.name}"


# Kuzov Yechib Ornatish vaqt koefitsienti
class KuzovDetailCoefficient(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name="Kuzovcoefficients")
    detail = models.ForeignKey(KuzovYechibOrnatish, on_delete=models.CASCADE, related_name="Kuzovcoefficients")
    coefficient = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ("car_model", "detail")
        verbose_name = "Kuzov Detail Coefficient"
        verbose_name_plural = "Kuzov Detail Coefficients"

    def __str__(self):
        return f"{self.car_model.id} {self.car_model} - {self.detail} ({self.coefficient})"


# Ichki Detallar Yechib Ornatish
class IchkiDetallarYechibOrnatish(models.Model):
    img = models.ImageField(upload_to="IchkiDetallar/")
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Ichki Detallar Yechib Ornatish"
        verbose_name_plural = "Ichki Detallar Yechib Ornatishlar"

    def __str__(self):
        return f"{self.name}"


class IchkiDetailCoefficient(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name="IchkiDetalcoefficients")
    detail = models.ForeignKey(IchkiDetallarYechibOrnatish, on_delete=models.CASCADE, related_name="IchkiDetalcoefficients")
    coefficient = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ("car_model", "detail")
        verbose_name = "Ichki Detail Coefficient"
        verbose_name_plural = "Ichki Detail Coefficients"

    def __str__(self):
        return f"{self.car_model.id} {self.car_model} - {self.detail} ({self.coefficient})"


# Tamirlash Darajasi
class TamirlashDarajasi(models.Model):
    level = models.CharField()

    class Meta:
        verbose_name = "Tamirlash Darajasi"
        verbose_name_plural = "Tamirlash Darajalari"

    def __str__(self):
        return f"{self.level}"


# Yechiladigan Detallar Tamirlash
class YechiladiganDetallarTamirlash(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Yechiladigan Detallar Tamirlash"
        verbose_name_plural = "Yechiladigan Detallar Tamirlashlar"

    def __str__(self):
        return f"{self.id} {self.name}"


class TamirlashVaqtiYechiladigan(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE)
    detail = models.ForeignKey(YechiladiganDetallarTamirlash, on_delete=models.CASCADE)
    daraja = models.ForeignKey(TamirlashDarajasi, on_delete=models.CASCADE)
    vaqt = models.FloatField()

    class Meta:
        unique_together = ('car_model', 'detail', 'daraja')
        verbose_name = "Tamirlash Vaqti Yechiladigan"
        verbose_name_plural = "Tamirlash Vaqti Yechiladiganlar"

    def __str__(self):
        return f"{self.car_model} - {self.detail} - {self.daraja}: {self.vaqt}"


# Yechilmaydigan Detallar Tamirlash
class YechilmaydiganDetallarTamirlash(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Yechilmaydigan Detallar Tamirlash"
        verbose_name_plural = "Yechilmaydigan Detallar Tamirlashlar"

    def __str__(self):
        return f"{self.name}"

# Tamirlash Vaqti Yechilmaydigan
class TamirlashVaqtiYechilmaydigan(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE)
    detail = models.ForeignKey(YechilmaydiganDetallarTamirlash, on_delete=models.CASCADE)
    daraja = models.ForeignKey(TamirlashDarajasi, on_delete=models.CASCADE)
    vaqt = models.FloatField()

    class Meta:
        unique_together = ('car_model', 'detail', 'daraja')
        verbose_name = "Tamirlash Vaqti Yechilmaydigan"
        verbose_name_plural = "Tamirlash Vaqti Yechilmaydiganlar"

    def __str__(self):
        return f"{self.car_model} - {self.detail} - {self.daraja}: {self.vaqt}"

# Materiallar
class Materiallar(models.Model):
    name = models.CharField(max_length=100)
    olchov_birligi = models.CharField(max_length=20)
    miqdor = models.FloatField(default=1)
    narxi = models.FloatField()

    class Meta:
        verbose_name = "Material"
        verbose_name_plural = "Materiallar"

    def __str__(self):
        return f"{self.name}"


# Avto

class KuzovGeometrikMurakkablik(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        verbose_name = "Kuzov Geometrik Murakkablik"
        verbose_name_plural = "Kuzovlar Geometrik Murakkablik"

    def __str__(self):
        return self.name

class KuzovGeometrikMurakkablikCoefficienti(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name="KuzovGeometrikMurakkablikCoefficienti")
    geometrik_murakkablik = models.ForeignKey(KuzovGeometrikMurakkablik, on_delete=models.CASCADE, related_name="KuzovGeometrikMurakkablikCoefficienti")
    coefficient = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ("car_model", "geometrik_murakkablik")
        verbose_name = "Kuzovlar Geometrik Murakkablik  Coeficienti"
        verbose_name_plural = "Kuzovlar Geometrik Murakkablik Coeficienti"

    def __str__(self):
        return f"{self.car_model.id} {self.car_model} - {self.geometrik_murakkablik} ({self.coefficient})"


class AlmashtiriladiganUTC(models.Model):
    detail = models.ForeignKey(KuzovYechibOrnatish, on_delete=models.CASCADE)
    vaqt = models.FloatField()

    class Meta:
        verbose_name = "Almashtirish UTC jadvali"
        verbose_name_plural = "Almashtirish UTC jadvali"

    def __str__(self):
        return f" {self.detail} : {self.vaqt} "
   
class TamirlashYechilmaydiganUTC(models.Model):
    detal = models.ForeignKey(
        YechilmaydiganDetallarTamirlash,
        on_delete=models.CASCADE,
        related_name="TamirlashYechilmaydiganUTC"
    )
    tamir_turi = models.ForeignKey(
        TamirlashDarajasi,
        on_delete=models.CASCADE,
        related_name="TamirlashYechilmaydiganUTC"
    )
    coefficient = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ("detal", "tamir_turi")
        verbose_name = "Tamirlash UTC (Yechilmaydigan)"
        verbose_name_plural = "Tamirlash UTC (Yechilmaydigan)"

    def __str__(self):
        return f"{self.detal} - {self.tamir_turi} ({self.coefficient})"
    
class TamirlashYechiladiganUTC(models.Model):
    detal = models.ForeignKey(
        YechiladiganDetallarTamirlash,
        on_delete=models.CASCADE,
        related_name="TamirlashYechiladiganUTC"
    )
    tamir_turi = models.ForeignKey(
        TamirlashDarajasi,
        on_delete=models.CASCADE,
        related_name="TamirlashYechiladiganUTC"
    )
    coefficient = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ("detal", "tamir_turi")
        verbose_name = "Tamirlash UTC (Yechiladigan)"
        verbose_name_plural = "Tamirlash UTC (Yechiladigan)"

    def __str__(self):
        return f"{self.detal} - {self.tamir_turi} ({self.coefficient})"

class KuzovTuriYemirilish(models.Model):
    kuzov = models.ForeignKey(Kuzov, on_delete=models.CASCADE, related_name="KuzovTuriYemirilish")
    coefficient = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        verbose_name = "Kuzov Turi Yemirilish"
        verbose_name_plural = "Kuzov Turi Yemirilish"

    def __str__(self):
        return f"{self.kuzov.id} {self.kuzov} - ({self.coefficient})"

# models.py
class TanlanganDetal(models.Model):
    kuzov_ids = models.JSONField(default=list, blank=True)
    ichki_ids = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f" {self.id} {self.kuzov_ids} {self.ichki_ids}"
    
    
# BoyoqlashVaqtiYechiladigan
class BoyoqlashVaqtiYechiladiganlar(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE)
    detail = models.ForeignKey(YechiladiganDetallarTamirlash, on_delete=models.CASCADE)
    vaqt = models.FloatField()

    class Meta:
        unique_together = ('car_model', 'detail')
        verbose_name = "Boyoqlash Vaqti Yechiladiganlar"
        verbose_name_plural = "Boyoqlash Vaqti Yechiladiganlar"

    def __str__(self):
        return f"{self.id} {self.car_model} - {self.detail}: {self.vaqt}"

# BoyoqlashVaqtiYechilmaydigan
class BoyoqlashVaqtiYechilmaydiganlar(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE)
    detail = models.ForeignKey(YechilmaydiganDetallarTamirlash, on_delete=models.CASCADE)
    vaqt = models.FloatField()

    class Meta:
        unique_together = ('car_model', 'detail')
        verbose_name = "Boyoqlash Vaqti Yechilmaydiganlar"
        verbose_name_plural = "Boyoqlash Vaqti Yechilmaydiganlar"

    def __str__(self):
        return f"{self.id} {self.car_model} - {self.detail} : {self.vaqt}"

# SilliqlashVaqtiYechiladigan
class SilliqlashVaqtiYechiladiganlar(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE)
    detail = models.ForeignKey(YechiladiganDetallarTamirlash, on_delete=models.CASCADE)
    vaqt = models.FloatField()

    class Meta:
        unique_together = ('car_model', 'detail')
        verbose_name = "Silliqlash Vaqti Yechiladiganlar"
        verbose_name_plural = "Silliqlash Vaqti Yechiladiganlar"

    def __str__(self):
        return f"{self.car_model} - {self.detail} : {self.vaqt}"

# SilliqlashVaqtiYechilmaydigan
class SilliqlashVaqtiYechilmaydiganlar(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE)
    detail = models.ForeignKey(YechilmaydiganDetallarTamirlash, on_delete=models.CASCADE)
    vaqt = models.FloatField()

    class Meta:
        unique_together = ('car_model', 'detail')
        verbose_name = " Silliqlash Vaqti Yechilmaydiganlar"
        verbose_name_plural = " Silliqlash Vaqti Yechilmaydiganlar"

    def __str__(self):
        return f"{self.car_model} - {self.detail} : {self.vaqt}"


    
class Shablon(models.Model):
    nom = models.CharField(max_length=255)
    fayl = models.FileField(upload_to="shablon")

    def __str__(self):
        return self.nom

class Cars(models.Model):
    # shablonNomi = models.CharField(default=0)
    # rasm1 = models.FileField(upload_to="cars", blank=True, null=True)
    # rasm2 = models.FileField(upload_to="cars", blank=True, null=True)
    # rasm3 = models.FileField(upload_to="cars", blank=True, null=True)
    # rasm4 = models.FileField(upload_to="cars", blank=True, null=True)
    # rasm5 = models.FileField(upload_to="cars", blank=True, null=True)
    # rasm6 = models.FileField(upload_to="cars", blank=True, null=True)
    
    # ustama = models.FloatField(default=0)
    # UTCdanKeyingiNarx = models.CharField(max_length=255, default=0)
    # GMC = models.CharField(max_length=255, default=0)
    # UTCdanKeyingiBozorBahosi = models.FloatField(default=0)
    # natijaviySummaYozuvda = models.CharField(max_length=255, blank=True, null=True)
    # umumiyUTC = models.FloatField(default=0)
    # boyoqlashUTC = models.CharField(max_length=255, blank=True, null=True)
    # sumTamir2 = models.CharField(max_length=255, blank=True, null=True)
    # sumTamir3 = models.CharField(max_length=255, blank=True, null=True)
    # UTCAlmashtirish = models.CharField(max_length=255, blank=True, null=True)
    # almashtirishGeometrikegrilik = models.CharField(max_length=255, blank=True, null=True)
    
    # HJY = models.CharField(max_length=50, blank=True, null=True)
    # FY = models.CharField(max_length=50, blank=True, null=True)
    # YY = models.CharField(max_length=50, blank=True, null=True)
    
    # materiallar = models.JSONField(blank=True, null=True)
    # almashadiganDetallar = models.JSONField(blank=True, null=True)
    
    # umumiyTamir = models.CharField(max_length=255, blank=True, null=True)
    # tableTamirYechiladigan = models.JSONField(blank=True, null=True)
    # tableTamirYechilmaydigan = models.JSONField(blank=True, null=True)
    # tableIchki = models.JSONField(blank=True, null=True)
    # tableKuzov = models.JSONField(blank=True, null=True)
    
    # davlatRaqami = models.CharField(max_length=20, blank=True, null=True)
    # dvigatelRaqami = models.CharField(max_length=50, blank=True, null=True)
    # egasiningIsmi = models.CharField(max_length=255, blank=True, null=True)
    # expert = models.CharField(max_length=255, blank=True, null=True)
    # fotoaparatModeli = models.CharField(max_length=255, blank=True, null=True)
    # kuzovTuri = models.CharField(max_length=255, blank=True, null=True)
    # kMC = models.CharField(max_length=50, blank=True, null=True)
    # kMT = models.CharField(max_length=50, blank=True, null=True)
    # kuzovRaqami = models.CharField(max_length=50, blank=True, null=True)
    # model = models.CharField(max_length=255, blank=True, null=True)
    # rangi = models.CharField(max_length=50, blank=True, null=True)
    # uzatmalarQutisi = models.CharField(max_length=50, blank=True, null=True)
    # xulosaRaqami = models.CharField(max_length=50, blank=True, null=True)
    # xulosaSanasi = models.CharField(max_length=255, blank=True, null=True)
    # arizaSanasi = models.CharField(max_length=255, blank=True, null=True)
    # texpassportBerilganJoy = models.CharField(max_length=255, blank=True, null=True)
    
    # hozirgiYil = models.IntegerField(default=0)
    # arizaTushganKun = models.CharField(max_length=255, blank=True, null=True)
    # ishlabChiqarilganYil = models.IntegerField(default=0)
    # odometrKorsatkichi = models.IntegerField(default=0)
    # odometrNorma = models.IntegerField(default=0)
    # ishlabChiqarishdanToxtaganYil = models.IntegerField(default=0)
    # savdolashishcoefficienti = models.CharField(max_length=255, blank=True, null=True)
    
    # ishlabChiqarish = models.CharField(max_length=255, default=False)
    # odometrSozmi = models.CharField(max_length=255, default=False)
    # texpassportBerilganmi = models.CharField(max_length=255, default=False)
    
    # texpasportBerilganligi = models.CharField(max_length=255,blank=True, null=True)
    # chiqishToxtaganYil = models.IntegerField(default=0)
    # haqiqiyHizmatMuddati = models.IntegerField(default=0)
    # tanlanganJismoniyEskirish = models.CharField(max_length=255, blank=True, null=True)
    # jismoniyEskirishdanKeyingiSumma = models.CharField(max_length=255, blank=True, null=True)
    # analog1OdometrKorsatkichi = models.IntegerField(default=0)
    # analog2OdometrKorsatkichi = models.IntegerField(default=0)
    # analog3OdometrKorsatkichi = models.IntegerField(default=0)
    # analogNarxi1 = models.FloatField(default=0)
    # analogNarxi2 = models.FloatField(default=0)
    # analogNarxi3 = models.FloatField(default=0)
    
    # boyoqlashVaqti = models.FloatField(default=0)
    # silliqlashVaqti = models.FloatField(default=0)
    # soatigaTolanadiganIshHaqqi = models.FloatField(default=0)
    # umumiyUstaHaqqi = models.FloatField(default=0)
    # yangisiningNarxi = models.FloatField(default=0)
    # ortachaNarx = models.FloatField(default=0)
    # jismoniyEskirish = models.FloatField(default=0)
    # bozorBahosi = models.FloatField(default=0)
    # umumiyNarxExtiyotQisimlar = models.FloatField(default=0)
    # jismoniyEskirishdanKeyingiNarx = models.FloatField(default=0)
    # umumiyNarxMateriallar = models.FloatField(default=0)
    # natijaviySumma = models.FloatField(default=0)
    
    # created_at = models.DateTimeField(null=True, auto_now_add=True)
    
    def __str__(self):
        return f"{self.egasiningIsmi} - {self.davlatRaqami}"

# # 🔹 Post-delete signal
# @receiver(post_delete, sender=Shablon)
# def shablon_file_delete(sender, instance, **kwargs):
#     """Model o'chirilganda faylni ham o'chirish"""
#     if instance.fayl and os.path.isfile(instance.fayl.path):
#         os.remove(instance.fayl.path)