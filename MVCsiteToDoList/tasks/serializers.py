from rest_framework import serializers
from tasks.models import Tasks


class TasksSerializer(serializers.ModelSerializer):
    # Класс поля, который не принимает значение на основе пользовательского ввода,
    # а вместо этого берет свое значение из значения по умолчанию или вызываемого объекта.
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # В class Meta мы указываем модель, с которой должен работать данный сериализатор,
    # и набор полей таблицы (атрибутов модели) для сериализации.
    class Meta:
        model = Tasks
        fields = '__all__'