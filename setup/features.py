from flask import Blueprint, render_template, request, flash, abort, jsonify, redirect, url_for, send_from_directory
from flask_login import login_required, current_user
from .models import MenuItem
from . import db
import json
import os

# for image uploading
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
target = os.path.join(APP_ROOT, 'images/')
if not os.path.isdir(target):
    os.mkdir(target)

views = Blueprint('views', __name__)


