# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2019-08-19 12:30
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.auth.validators
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('news_site', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AdType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('type', models.CharField(max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Advertisement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('ad_text', models.CharField(max_length=160)),
                ('ad_url', models.URLField()),
                ('media', models.ImageField(blank=True, null=True, upload_to='')),
                ('is_active', models.BooleanField(default=True)),
                ('impsn_limit', models.IntegerField(default=0)),
                ('delivered', models.IntegerField(default=0)),
                ('click_count', models.IntegerField(default=0)),
                ('ad_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.AdType')),
                ('adgroup', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.AdGroup')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('name', models.CharField(max_length=160)),
                ('is_active', models.BooleanField(default=True)),
                ('daily_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ('max_bid', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CategoryAssociation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('child_cat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='child_category', to='news_site.Category')),
                ('parent_cat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parent_category', to='news_site.Category')),
            ],
        ),
        migrations.CreateModel(
            name='CategoryDefaultImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('default_image_url', models.URLField()),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.Category')),
            ],
        ),
        migrations.CreateModel(
            name='DailyDigest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Devices',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('device_name', models.CharField(blank=True, max_length=255, null=True)),
                ('device_id', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Menu',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.Category')),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('breaking_news', models.BooleanField(default=False)),
                ('daily_edition', models.BooleanField(default=False)),
                ('personalized', models.BooleanField(default=False)),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.Devices')),
            ],
        ),
        migrations.CreateModel(
            name='ScoutedItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('url', models.URLField(default='http://nowhe.re')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.Category')),
            ],
        ),
        migrations.CreateModel(
            name='ScoutFrontier',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(default='http://nowhe.re')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.Category')),
            ],
        ),
        migrations.CreateModel(
            name='SocialAccount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('provider', models.CharField(max_length=200)),
                ('social_account_id', models.CharField(max_length=200)),
                ('image_url', models.CharField(blank=True, max_length=250, null=True)),
            ],
            options={
                'verbose_name_plural': 'Social Accounts',
            },
        ),
        migrations.CreateModel(
            name='SubMenu',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hash_tags', models.ManyToManyField(to='news_site.HashTag')),
                ('name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.Category')),
            ],
        ),
        migrations.CreateModel(
            name='TrendingArticle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='Last Modified At')),
                ('active', models.BooleanField(default=True)),
                ('score', models.FloatField(default=0.0)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TrendingHashTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.RemoveField(
            model_name='subcategory',
            name='category',
        ),
        migrations.RemoveField(
            model_name='article',
            name='industry',
        ),
        migrations.RemoveField(
            model_name='article',
            name='sub_category',
        ),
        migrations.AddField(
            model_name='article',
            name='edited_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='article',
            name='edited_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='article',
            name='indexed_on',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='article',
            name='manually_edit',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='article',
            name='spam',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='articlemedia',
            name='video_url',
            field=models.TextField(blank=True, null=True, validators=[django.core.validators.URLValidator()]),
        ),
        migrations.AlterField(
            model_name='article',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='news_site.Category'),
        ),
        migrations.AlterField(
            model_name='article',
            name='cover_image',
            field=models.TextField(validators=[django.core.validators.URLValidator()]),
        ),
        migrations.AlterField(
            model_name='article',
            name='source_url',
            field=models.TextField(validators=[django.core.validators.URLValidator()]),
        ),
        migrations.AlterField(
            model_name='articlemedia',
            name='url',
            field=models.TextField(blank=True, null=True, validators=[django.core.validators.URLValidator()]),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='passion',
            field=models.ManyToManyField(blank=True, to='news_site.HashTag'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='username',
            field=models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username'),
        ),
        migrations.DeleteModel(
            name='Industry',
        ),
        migrations.DeleteModel(
            name='SubCategory',
        ),
        migrations.AddField(
            model_name='trendingarticle',
            name='articles',
            field=models.ManyToManyField(to='news_site.Article'),
        ),
        migrations.AddField(
            model_name='socialaccount',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='menu',
            name='submenu',
            field=models.ManyToManyField(to='news_site.SubMenu'),
        ),
        migrations.AddField(
            model_name='devices',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='dailydigest',
            name='articles',
            field=models.ManyToManyField(to='news_site.Article'),
        ),
        migrations.AddField(
            model_name='dailydigest',
            name='device',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.Devices'),
        ),
        migrations.AddField(
            model_name='adgroup',
            name='campaign',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news_site.Campaign'),
        ),
        migrations.AddField(
            model_name='adgroup',
            name='category',
            field=models.ManyToManyField(to='news_site.Category'),
        ),
    ]
