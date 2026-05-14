import os, json, requests
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GRequest

TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'token.json')
SHEET_ID   = '1B4drO9RVgZRwOk0hdNgCssbdtgmHkh3t-XzoT8_YVfo'
SHEET_NAME = 'Hoja1'
SCOPES     = ['https://www.googleapis.com/auth/spreadsheets']

print(f"Token file existe: {os.path.exists(TOKEN_FILE)}")
creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
print(f"valid={creds.valid}  expired={creds.expired}  expiry={creds.expiry}")

if not creds.valid:
    print("Refrescando token...")
    creds.refresh(GRequest())
    print(f"Nuevo token: valid={creds.valid}")

url = f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{requests.utils.quote(SHEET_NAME, safe="")}'
print(f"URL: {url}")
resp = requests.get(url, headers={'Authorization': f'Bearer {creds.token}'}, timeout=30)
print(f"Status: {resp.status_code}")
print(f"Body: {resp.text[:500]}")
