from mangum import Mangum
from .main import app

# AWS Lambda entrypoint: set handler to "app.handler.handler" when packaging this module
handler = Mangum(app)
