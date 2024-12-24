from django.contrib.auth.models import User
from django.db import models

class Tasks(models.Model):
    # текстовое поле, может быть пустым и пустое по умолчанию
    objects = None
    text = models.TextField(blank=True, default='')
    # флаг, выполнена ли задача или нет
    is_done = models.BooleanField(default=False)
    # привязка задачи к пользователю
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # В class Meta мы указываем имя таблицы в БД для данной модели.
class Meta:
    db_table = 'tasks'