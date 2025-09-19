from rest_framework import viewsets, status
from rest_framework.decorators import action
import base64
from datetime import datetime
from docxtpl import InlineImage
from docx.shared import Mm
from rest_framework.response import Response
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from docxtpl import DocxTemplate
import re, time 
import uuid 
from django.http import JsonResponse, HttpResponse
import os
from django.conf import settings
import json
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
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
    AlmashtiriladiganUTC,
    TamirlashYechilmaydiganUTC,
    TamirlashYechiladiganUTC,
    KuzovTuriYemirilish,
    TanlanganDetal,
    BoyoqlashVaqtiYechiladiganlar,
    BoyoqlashVaqtiYechilmaydiganlar,
    SilliqlashVaqtiYechiladiganlar,
    SilliqlashVaqtiYechilmaydiganlar,
    Shablon,
)
from .serializers import (
    CarModelSerializer,
    KuzovSerializer,
    ExpertSerializer,
    CarsSerializer,
    KuzovYechibOrnatishSerializer,
    KuzovDetailCoefficientSerializer,
    IchkiDetailCoefficientSerializer,
    IchkiDetallarYechibOrnatishSerializer,
    YechiladiganDetallarTamirlashSerializer,
    YechilmaydiganDetallarTamirlashSerializer,
    TamirlashVaqtiYechiladiganSerializer,
    TamirlashVaqtiYechilmaydiganSerializer,
    MateriallarSerializer,
    TamirlashDarajasiSerializer,
    KuzovGeometrikMurakkablikSerializer,
    KuzovGeometrikMurakkablikCoefficientiSerializer,
    AlmashtiriladiganUTCSerializer,
    TamirlashYechilmaydiganUTCSerializer,
    TamirlashYechiladiganUTCSerializer,
    KuzovTuriYemirilishSerializer,
    TanlanganDetalSerializer,
    BoyoqlashVaqtiYechiladiganlarSerializer,
    BoyoqlashVaqtiYechilmaydiganlarSerializer,
    SilliqlashVaqtiYechiladiganlarSerializer,
    SilliqlashVaqtiYechilmaydiganlarSerializer,
    ShablonSerializer
)


class CarModelViewSet(viewsets.ModelViewSet):
    queryset = CarModel.objects.all()
    serializer_class = CarModelSerializer


class KuzovViewSet(viewsets.ModelViewSet):
    queryset = Kuzov.objects.all()
    serializer_class = KuzovSerializer

class ExpertViewSet(viewsets.ModelViewSet):
    queryset = Expert.objects.all()
    serializer_class = ExpertSerializer
    
class CarsViewSet(viewsets.ModelViewSet):
    queryset = Cars.objects.all()
    serializer_class = CarsSerializer


class KuzovYechibOrnatishViewSet(viewsets.ModelViewSet):
    queryset = KuzovYechibOrnatish.objects.all()
    serializer_class = KuzovYechibOrnatishSerializer


class IchkiDetallarYechibOrnatishViewSet(viewsets.ModelViewSet):
    queryset = IchkiDetallarYechibOrnatish.objects.all()
    serializer_class = IchkiDetallarYechibOrnatishSerializer


class YechiladiganDetallarTamirlashViewSet(viewsets.ModelViewSet):
    queryset = YechiladiganDetallarTamirlash.objects.all()
    serializer_class = YechiladiganDetallarTamirlashSerializer


class YechilmaydiganDetallarTamirlashViewSet(viewsets.ModelViewSet):
    queryset = YechilmaydiganDetallarTamirlash.objects.all()
    serializer_class = YechilmaydiganDetallarTamirlashSerializer



class TamirlashVaqtiYechiladiganViewSet(viewsets.ModelViewSet):
    queryset = TamirlashVaqtiYechiladigan.objects.all()
    serializer_class = TamirlashVaqtiYechiladiganSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['car_model', 'detail', 'daraja']

class TamirlashVaqtiYechilmaydiganViewSet(viewsets.ModelViewSet):
    queryset = TamirlashVaqtiYechilmaydigan.objects.all()
    serializer_class = TamirlashVaqtiYechilmaydiganSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['car_model', 'detail', 'daraja']

    
class MateriallarViewSet(viewsets.ModelViewSet):
    queryset = Materiallar.objects.all()
    serializer_class = MateriallarSerializer

class TamirlashDarajasiViewSet(viewsets.ModelViewSet):
    queryset = TamirlashDarajasi.objects.all()
    serializer_class = TamirlashDarajasiSerializer


class KuzovDetailCoefficientViewSet(viewsets.ModelViewSet):
    queryset = KuzovDetailCoefficient.objects.all()
    serializer_class = KuzovDetailCoefficientSerializer

    def get_queryset(self):
        car_model_id = self.request.query_params.get("car_model_id")
        if car_model_id:
            return self.queryset.filter(car_model_id=car_model_id)
        return self.queryset.none()
    
    def retrieve(self, request, car_model_id=None):
        queryset = KuzovDetailCoefficient.objects.filter(car_model_id=car_model_id)
        serializer = (queryset)
        return Response(serializer.data)
    

    def create(self, request, *args, **kwargs):
        """
        Yangi detal + koeffitsient qo‘shish.
        Agar detal oldin bo‘lmasa — avval detail yaratiladi.
        """
        detail_data = request.data.get("detail")  # {"name": "...", "img": "..."}
        car_model_id = request.data.get("car_model")
        coefficient = request.data.get("coefficient")

        # 1. Detalni yaratish yoki olish
        if detail_data:
            detail = KuzovYechibOrnatish.objects.create(
                name=detail_data["name"],
                img=detail_data["img"]
            )
        else:
            return Response({"error": "Detail ma'lumotlari kerak"}, status=400)

        # 2. Coefficientni yaratish
        coef = KuzovDetailCoefficient.objects.create(
            car_model_id=car_model_id,
            detail=detail,
            coefficient=coefficient
        )

        serializer = self.get_serializer(coef)
        return Response(serializer.data, status=201)
    
class IchkiDetailCoefficientViewSet(viewsets.ModelViewSet):
    queryset = IchkiDetailCoefficient.objects.all()
    serializer_class = IchkiDetailCoefficientSerializer

    def get_queryset(self):
        car_model_id = self.request.query_params.get("car_model_id")
        if car_model_id:
            return self.queryset.filter(car_model_id=car_model_id)
        return self.queryset.none()

class KuzovGeometrikMurakkablikViewSet(viewsets.ModelViewSet):
    queryset = KuzovGeometrikMurakkablik.objects.all()
    serializer_class = KuzovGeometrikMurakkablikSerializer
   

class KuzovGeometrikMurakkablikCoefficientiViewSet(viewsets.ModelViewSet):
    queryset = KuzovGeometrikMurakkablikCoefficienti.objects.all()
    serializer_class = KuzovGeometrikMurakkablikCoefficientiSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['car_model', 'geometrik_murakkablik']
    
    def get_queryset(self):
        car_model_id = self.request.query_params.get("car_model_id")
        if car_model_id:
            return self.queryset.filter(car_model_id=car_model_id)
        return self.queryset.all()
    
class AlmashtiriladiganUTCViewSet(viewsets.ModelViewSet):
    queryset = AlmashtiriladiganUTC.objects.all()
    serializer_class = AlmashtiriladiganUTCSerializer
    
    
def employees(request):
    return render(request, "employees/index.html")




class TamirlashYechilmaydiganUTCViewSet(viewsets.ModelViewSet):
    queryset = TamirlashYechilmaydiganUTC.objects.all()
    serializer_class = TamirlashYechilmaydiganUTCSerializer

class TamirlashYechiladiganUTCViewSet(viewsets.ModelViewSet):
    queryset = TamirlashYechiladiganUTC.objects.all()
    serializer_class = TamirlashYechiladiganUTCSerializer
    
class KuzovTuriYemirilishViewSet(viewsets.ModelViewSet):
    queryset = KuzovTuriYemirilish.objects.all()
    serializer_class = KuzovTuriYemirilishSerializer

    def get_queryset(self):
        # Agar query params orqali kuzov_id kelsa, faqat shunga filter
        kuzov_id = self.request.query_params.get("kuzov_id")
        if kuzov_id:
            return self.queryset.filter(kuzov_id=kuzov_id)
        return self.queryset.none()


class TanlanganDetalViewSet(viewsets.ModelViewSet):
    TanlanganDetal.objects.all().delete()
    queryset = TanlanganDetal.objects.all()
    serializer_class = TanlanganDetalSerializer
    
class BoyoqlashVaqtiYechiladiganlarViewSet(viewsets.ModelViewSet):
    queryset = BoyoqlashVaqtiYechiladiganlar.objects.all()
    serializer_class = BoyoqlashVaqtiYechiladiganlarSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['car_model', 'detail']


class BoyoqlashVaqtiYechilmaydiganlarViewSet(viewsets.ModelViewSet):
    queryset = BoyoqlashVaqtiYechilmaydiganlar.objects.all()
    serializer_class = BoyoqlashVaqtiYechilmaydiganlarSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['car_model', 'detail']

class SilliqlashVaqtiYechiladiganlarViewSet(viewsets.ModelViewSet):
    queryset = SilliqlashVaqtiYechiladiganlar.objects.all()
    serializer_class = SilliqlashVaqtiYechiladiganlarSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['car_model', 'detail']

class SilliqlashVaqtiYechilmaydiganlarViewSet(viewsets.ModelViewSet):
    queryset = SilliqlashVaqtiYechilmaydiganlar.objects.all()
    serializer_class = SilliqlashVaqtiYechilmaydiganlarSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['car_model', 'detail']
    
class ShablonViewSet(viewsets.ModelViewSet):
    queryset = Shablon.objects.all()
    serializer_class = ShablonSerializer

@csrf_exempt
def generate_word(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Faqat POST ruxsat etiladi"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception as e:
        return JsonResponse({"success": False, "error": f"JSON xato: {e}"}, status=400)

    # Asosiy ma'lumotlar
    xulosaRaqami = data.get("xulosaRaqami", "-")
    model = data.get("model", "-")
    davlatRaqami = data.get("davlatRaqami", "-")
    shablonNomi = data.get("shablonNomi", '-')
    table_kuzov = data.get("tableKuzov", [])
    table_ichki = data.get("tableIchki", [])

    # Shablon fayl
    template_path = os.path.join(settings.MEDIA_ROOT, "shablon", shablonNomi)
    if not os.path.exists(template_path):
        return JsonResponse({"success": False, "error": f"Shablon topilmadi: {template_path}"}, status=404)

    doc = DocxTemplate(template_path)

    # Jadval tayyorlash
    jadvalKuzov = [
        {
            "index": idx,
            "detallar": row.get("name", ""),
            "coefficient": row.get("coefficient", 0),
            "soni": row.get("soni", 1),
            "narxi": row.get("narx", 0),
            "umumiy": row.get("umumiy", 0),
        }
        for idx, row in enumerate(table_kuzov, start=1)
    ]
       
    jadvalIchki = [
        {
            "index": idx + len(jadvalKuzov),
            "detallar": row.get("name", ""),
            "coefficient": row.get("coefficient", 0),
            "soni": row.get("soni", 1),
            "narxi": row.get("narx", 0),
            "umumiy": row.get("umumiy", 0),
        }
        for idx, row in enumerate(table_ichki, start=1)
    ]

    umumiyJadval = jadvalKuzov + jadvalIchki

    # Context tayyorlash
    context = {
        **data,
        "umumiyJadval": umumiyJadval,
    }

    # 6 ta rasmni Data URL'dan saqlash va Word-ga qo'shish
    rasm_paths = []
    for i in range(1, 7):
        rasm_data_url = data.get(f"rasm{i}")
        if rasm_data_url:
            try:
                format, imgstr = rasm_data_url.split(";base64,")
                ext = format.split("/")[-1]
                filename = f"temp_rasm{i}.{ext}"
                filepath = os.path.join(settings.MEDIA_ROOT, filename)
                with open(filepath, "wb") as f:
                    f.write(base64.b64decode(imgstr))
                rasm_paths.append(filepath)
            except Exception as e:
                rasm_paths.append(None)
        else:
            rasm_paths.append(None)

    # Contextga InlineImage qo'shish
    for idx, rasm_path in enumerate(rasm_paths, start=1):
        if rasm_path and os.path.exists(rasm_path):
            context[f"rasm{idx}"] = InlineImage(doc, rasm_path, width=Mm(83), height=Mm(62.3))
        else:
            context[f"rasm{idx}"] = "Rasm topilmadi"

    # Word faylini render qilish
    doc.render(context)

    # Fayl nomini xavfsiz qilish
    def safe_filename(s: str) -> str:
        s = str(s or "file")
        s = re.sub(r"[/\\\s]+", "_", s)
        s = re.sub(r"[^A-Za-z0-9_.-]", "_", s)
        return s

    output_dir = os.path.join(settings.MEDIA_ROOT, "tayyor")
    os.makedirs(output_dir, exist_ok=True)
    now_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"{safe_filename(xulosaRaqami)}___{safe_filename(davlatRaqami)}_{safe_filename(model)}_{now_str}.docx"
    output_path = os.path.join(output_dir, filename)

    try:
        doc.save(output_path)
    except Exception as e:
        return JsonResponse({"success": False, "error": f"Saqlashda xato: {e}"}, status=500)

    return JsonResponse({
        "success": True,
        "filename": filename,
        "url": f"{settings.MEDIA_URL}tayyor/{filename}"
})
    
@csrf_exempt
def save_car(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            car = Cars.objects.create(**data)
            return JsonResponse({"success": True, "id": car.id})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Invalid method"})