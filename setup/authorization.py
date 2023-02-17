from flask import Blueprint, jsonify, render_template, request, flash, redirect, url_for
from .models import User, CompanyUser
import json
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import random

authorization = Blueprint('auth', __name__)


@authorization.route('/home', methods=['GET'])
def start_page():
    print('hi')
    email = request.form.get('email')
    password = request.form.get('password')
    return {'members': ['member1', 'member2']}


@authorization.route('/test', methods=['POST'])
def test():
    form_data = json.loads(request.data)
    print('test:', form_data)

    return jsonify({})


@authorization.route('/username-check/<username>/<user_type>', methods=['GET', 'POST'])
def username_check(username, user_type):
    # if username is
    print('user check func')
    if username != '':
        if user_type == 'user':
            user = User.query.filter_by(username=username).first()
            print(user)
        else:
            user = CompanyUser.query.filter_by(username=username).first()
        if user:
            return 'True'
        else:
            return 'False'




