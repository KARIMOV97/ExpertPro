from rest_framework import serializers
import os
from .models import (
    CarModel,
    Kuzov,
    Expert,
    Cars,
    KuzovYechibOrnatish,
    KuzovDetailCoefficient,
    IchkiDetailCoefficient,
    IchkiDetallarYechibOrnatish,
    YechiladiganDetallarTamirlash,
    YechilmaydiganDetallarTamirlash,
    TamirlashVaqtiYechiladigan,
    TamirlashVaqtiYechilmaydigan,
    Materiallar,
    TamirlashDarajasi,
    KuzovGeometrikMurakkablik,
    KuzovGeometrikMurakkablikCoefficienti,
    TamirlashYechilmaydiganUTC,
    AlmashtiriladiganUTC,
    TamirlashYechiladiganUTC,
    KuzovTuriYemirilish,
    TanlanganDetal,
    BoyoqlashVaqtiYechiladiganlar,
    BoyoqlashVaqtiYechilmaydiganlar,
    SilliqlashVaqtiYechiladiganlar,
    SilliqlashVaqtiYechilmaydiganlar,
    Shablon,
)


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModel
        fields = "__all__"


class KuzovYechibOrnatishSerializer(serializers.ModelSerializer):
    class Meta:
        model = KuzovYechibOrnatish
        fields = ["id", "img", "name"]


class KuzovDetailCoefficientSerializer(serializers.ModelSerializer):
    detail = KuzovYechibOrnatishSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=KuzovYechibOrnatish.objects.all(),
        source="detail",
        write_only=True
    )

    class Meta:
        model = KuzovDetailCoefficient
        fields = ["id", "car_model", "detail", "detail_id", "coefficient"]

class IchkiDetallarYechibOrnatishSerializer(serializers.ModelSerializer):
    class Meta:
        model = IchkiDetallarYechibOrnatish
        fields = "__all__"
           
class IchkiDetailCoefficientSerializer(serializers.ModelSerializer):
    detail = IchkiDetallarYechibOrnatishSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=IchkiDetallarYechibOrnatish.objects.all(),
        source="detail",
        write_only=True
    )

    class Meta:
        model = IchkiDetailCoefficient
        fields = ["id", "car_model", "detail", "detail_id", "coefficient"]  
         
class KuzovSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kuzov
        fields = "__all__"
        
class ExpertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expert
        fields = "__all__"
        
class CarsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cars
        fields = "__all__"

class YechiladiganDetallarTamirlashSerializer(serializers.ModelSerializer):
    class Meta:
        model = YechiladiganDetallarTamirlash
        fields = "__all__"

class TamirlashDarajasiSerializer(serializers.ModelSerializer):
    class Meta:
        model = TamirlashDarajasi
        fields = "__all__"
        
class TamirlashVaqtiYechiladiganSerializer(serializers.ModelSerializer):
    car_model = CarModelSerializer(read_only=True)
    car_model_id = serializers.PrimaryKeyRelatedField(
        queryset=CarModel.objects.all(), source='car_model', write_only=True
    )

    detail = YechiladiganDetallarTamirlashSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=YechiladiganDetallarTamirlash.objects.all(), source='detail', write_only=True
    )

    daraja = TamirlashDarajasiSerializer(read_only=True)
    daraja_id = serializers.PrimaryKeyRelatedField(
        queryset=TamirlashDarajasi.objects.all(), source='daraja', write_only=True
    )
    
    class Meta:
        model = TamirlashVaqtiYechiladigan
        fields = [
            'id',
            'car_model', 'car_model_id',
            'detail', 'detail_id',
            'daraja', 'daraja_id',
            'vaqt'
        ]
        
class YechilmaydiganDetallarTamirlashSerializer(serializers.ModelSerializer):
    class Meta:
        model = YechilmaydiganDetallarTamirlash
        fields = "__all__"

class TamirlashVaqtiYechilmaydiganSerializer(serializers.ModelSerializer):
    car_model = CarModelSerializer(read_only=True)
    car_model_id = serializers.PrimaryKeyRelatedField(
        queryset=CarModel.objects.all(), source='car_model', write_only=True
    )

    detail = YechilmaydiganDetallarTamirlashSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=YechilmaydiganDetallarTamirlash.objects.all(), source='detail', write_only=True
    )

    daraja = TamirlashDarajasiSerializer(read_only=True)
    daraja_id = serializers.PrimaryKeyRelatedField(
        queryset=TamirlashDarajasi.objects.all(), source='daraja', write_only=True
    )
    
    class Meta:
        model = TamirlashVaqtiYechilmaydigan
        fields = [
            'id',
            'car_model', 'car_model_id',
            'detail', 'detail_id',
            'daraja', 'daraja_id',
            'vaqt'
        ]
        
class MateriallarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materiallar
        fields = "__all__"

class KuzovGeometrikMurakkablikSerializer(serializers.ModelSerializer):
    class Meta:
        model = KuzovGeometrikMurakkablik
        fields = "__all__"
        
class KuzovGeometrikMurakkablikCoefficientiSerializer(serializers.ModelSerializer):
    detail = KuzovGeometrikMurakkablikSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=KuzovGeometrikMurakkablik.objects.all(),
        source="detail",
        write_only=True
    )

    class Meta:
        model = KuzovGeometrikMurakkablikCoefficienti
        fields = ["id", "car_model", "detail", "detail_id", "coefficient"]  

class AlmashtiriladiganUTCSerializer(serializers.ModelSerializer):
    detail = KuzovYechibOrnatishSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=KuzovYechibOrnatish.objects.all(), source='detail', write_only=True
    )
    
    class Meta:
        model = AlmashtiriladiganUTC   
        fields = "__all__"
        
class TamirlashYechilmaydiganUTCSerializer(serializers.ModelSerializer):
    tamir_turi = serializers.CharField(source='tamir_turi.level', read_only=True)

    class Meta:
        model = TamirlashYechilmaydiganUTC
        fields = "__all__"
        
class TamirlashYechiladiganUTCSerializer(serializers.ModelSerializer):
    tamir_turi = serializers.CharField(source='tamir_turi.level', read_only=True)

    class Meta:
        model = TamirlashYechiladiganUTC
        fields = "__all__"

# KuzovTuriYemirilish
class KuzovTuriYemirilishSerializer(serializers.ModelSerializer):
    class Meta:
        model = KuzovTuriYemirilish
        fields = ['id', 'kuzov', 'coefficient']


class TanlanganDetalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TanlanganDetal
        fields = '__all__' 
        
# BoyoqlashVaqtiYechiladigan
class BoyoqlashVaqtiYechiladiganlarSerializer(serializers.ModelSerializer):
    car_model = CarModelSerializer(read_only=True)
    car_model_id = serializers.PrimaryKeyRelatedField(
        queryset=CarModel.objects.all(), source='car_model', write_only=True
    )

    detail = YechiladiganDetallarTamirlashSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=YechiladiganDetallarTamirlash.objects.all(), source='detail', write_only=True
    )

    class Meta:
        model = BoyoqlashVaqtiYechiladiganlar
        fields = [
            "id",
            "car_model", "car_model_id",
            "detail", "detail_id",
            "vaqt"
        ]


# BoyoqlashVaqtiYechilmaydigan
class BoyoqlashVaqtiYechilmaydiganlarSerializer(serializers.ModelSerializer):
    car_model = CarModelSerializer(read_only=True)
    car_model_id = serializers.PrimaryKeyRelatedField(
        queryset=CarModel.objects.all(), source='car_model', write_only=True
    )

    detail = YechilmaydiganDetallarTamirlashSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=YechilmaydiganDetallarTamirlash.objects.all(), source='detail', write_only=True
    )

    class Meta:
        model = BoyoqlashVaqtiYechilmaydiganlar
        fields = [
            "id",
            "car_model", "car_model_id",
            "detail", "detail_id",
            "vaqt"
        ]


# SilliqlashVaqtiYechiladigan
class SilliqlashVaqtiYechiladiganlarSerializer(serializers.ModelSerializer):
    car_model = CarModelSerializer(read_only=True)
    car_model_id = serializers.PrimaryKeyRelatedField(
        queryset=CarModel.objects.all(), source='car_model', write_only=True
    )

    detail = YechiladiganDetallarTamirlashSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=YechiladiganDetallarTamirlash.objects.all(), source='detail', write_only=True
    )

    class Meta:
        model = SilliqlashVaqtiYechiladiganlar
        fields = [
            "id",
            "car_model", "car_model_id",
            "detail", "detail_id",
            "vaqt"
        ]


# SilliqlashVaqtiYechilmaydigan
class SilliqlashVaqtiYechilmaydiganlarSerializer(serializers.ModelSerializer):
    car_model = CarModelSerializer(read_only=True)
    car_model_id = serializers.PrimaryKeyRelatedField(
        queryset=CarModel.objects.all(), source='car_model', write_only=True
    )

    detail = YechilmaydiganDetallarTamirlashSerializer(read_only=True)
    detail_id = serializers.PrimaryKeyRelatedField(
        queryset=YechilmaydiganDetallarTamirlash.objects.all(), source='detail', write_only=True
    )

    class Meta:
        model = SilliqlashVaqtiYechilmaydiganlar
        fields = [
            "id",
            "car_model", "car_model_id",
            "detail", "detail_id",
            "vaqt"
        ]
        
class ShablonSerializer(serializers.ModelSerializer):
    fayl_nomi = serializers.SerializerMethodField()

    class Meta:
        model = Shablon
        fields = ["id", "nom", "fayl_nomi", "fayl"]  # url ham chiqishi uchun faylni ham qoldirdim

    def get_fayl_nomi(self, obj):
        return os.path.basename(obj.fayl.name)