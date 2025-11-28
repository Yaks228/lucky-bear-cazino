#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для скачивания всех изображений с сайта luckybear.guru
"""

import os
import re
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import time

def download_image(url, folder='images', filename=None):
    """Скачивает изображение по URL"""
    try:
        response = requests.get(url, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        response.raise_for_status()
        
        if filename is None:
            # Извлекаем имя файла из URL
            parsed = urlparse(url)
            filename = os.path.basename(parsed.path)
            if not filename or '.' not in filename:
                filename = f"image_{hash(url) % 10000}.jpg"
        
        filepath = os.path.join(folder, filename)
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ Скачано: {filename}")
        return True
    except Exception as e:
        print(f"✗ Ошибка при скачивании {url}: {e}")
        return False

def get_all_images_from_page(url):
    """Получает все изображения со страницы"""
    try:
        response = requests.get(url, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        images = []
        
        # Находим все теги img
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if src:
                # Преобразуем относительные URL в абсолютные
                full_url = urljoin(url, src)
                images.append(full_url)
        
        # Находим изображения в CSS (background-image)
        style_tags = soup.find_all('style')
        for style in style_tags:
            if style.string:
                # Ищем url() в CSS
                urls = re.findall(r'url\(["\']?([^"\']+)["\']?\)', style.string)
                for img_url in urls:
                    full_url = urljoin(url, img_url)
                    images.append(full_url)
        
        # Находим изображения в inline стилях
        for tag in soup.find_all(style=True):
            style = tag.get('style', '')
            urls = re.findall(r'url\(["\']?([^"\']+)["\']?\)', style)
            for img_url in urls:
                full_url = urljoin(url, img_url)
                images.append(full_url)
        
        return list(set(images))  # Убираем дубликаты
    except Exception as e:
        print(f"✗ Ошибка при загрузке страницы: {e}")
        return []

def main():
    url = 'https://luckybear.guru/'
    images_folder = 'images'
    
    # Создаем папку для изображений
    os.makedirs(images_folder, exist_ok=True)
    
    print(f"Загружаю страницу: {url}")
    print("Поиск изображений...")
    
    images = get_all_images_from_page(url)
    
    if not images:
        print("Изображения не найдены на странице.")
        print("\nПопробую альтернативный метод - скачаю основные изображения напрямую...")
        
        # Попробуем скачать основные изображения, которые обычно есть на таких сайтах
        common_images = [
            ('logo.png', 'logo'),
            ('main-logo.png', 'main-logo'),
            ('footer-logo.png', 'footer-logo'),
        ]
        
        for filename, name in common_images:
            for ext in ['png', 'jpg', 'svg', 'webp']:
                test_url = urljoin(url, f'images/{name}.{ext}')
                if download_image(test_url, images_folder, f'{name}.{ext}'):
                    break
                test_url = urljoin(url, f'assets/{name}.{ext}')
                if download_image(test_url, images_folder, f'{name}.{ext}'):
                    break
        return
    
    print(f"\nНайдено {len(images)} изображений")
    print("Начинаю скачивание...\n")
    
    downloaded = 0
    for i, img_url in enumerate(images, 1):
        print(f"[{i}/{len(images)}] {img_url}")
        
        # Извлекаем имя файла
        parsed = urlparse(img_url)
        filename = os.path.basename(parsed.path)
        
        # Если нет расширения, пытаемся определить по Content-Type
        if '.' not in filename:
            try:
                head = requests.head(img_url, timeout=5)
                content_type = head.headers.get('Content-Type', '')
                if 'image' in content_type:
                    ext = content_type.split('/')[-1].split(';')[0]
                    filename = f"image_{i}.{ext}"
            except:
                filename = f"image_{i}.jpg"
        
        if download_image(img_url, images_folder, filename):
            downloaded += 1
        
        time.sleep(0.5)  # Небольшая задержка между запросами
    
    print(f"\n✓ Готово! Скачано {downloaded} из {len(images)} изображений")
    print(f"Изображения сохранены в папку: {images_folder}/")

if __name__ == '__main__':
    main()

