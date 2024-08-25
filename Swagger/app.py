from flask import Flask, request
from flask_restx import Api, Resource, fields
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId, json_util
from dateutil import parser as date_parser
import json

# MongoDB Connection
client = MongoClient('mongodb://localhost:27017/')
db = client['VetPro']  # Your database name

app = Flask(__name__)
CORS(app)  # Enable CORS
api = Api(app, version='1.0', title='VetPro Crud API',
          description='Built by Roan Palm')

# Custom field for ObjectId to handle Mongo's unique IDs
class ObjectIdField(fields.Raw):
    def format(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        raise ValueError('Value must be an instance of ObjectId')

# Model definitions
procedure_model = api.model('Procedure', {
    'procedure_name': fields.String(required=True, description='Name of the procedure'),
    'doctor_name': fields.String(required=True, description='Name of the doctor performing the procedure'),
    'actions': fields.List(fields.Nested(api.model('Action', {
        'date_time': fields.DateTime(dt_format='iso8601', required=True, description='Date and time of the action'),
        'action': fields.String(required=True, description='Description of the action')
    })))
})

data_model = api.model('Data', {
    '_id': ObjectIdField(attribute='id', description='Document ID', readonly=True),
    'ownername': fields.String(required=True, description='Name of the pet owner'),
    'patientname': fields.String(required=True, description='Name of the patient (pet)'),
    'procedures': fields.List(fields.Nested(procedure_model))
})

ns = api.namespace('vet', description='Veterinary procedures operations')
col = db['Procedures']

@ns.route('/')
class ProceduresList(Resource):
    @ns.doc('list_procedures')
    def get(self):
        """List all procedures"""
        procedures = list(col.find())
        return json.loads(json_util.dumps(procedures))

    @ns.doc('create_procedure')
    @ns.expect(data_model)
    @ns.marshal_with(data_model, code=201)
    def post(self):
        """Add a new procedure"""
        data = request.json
        result = col.insert_one(data)
        data['_id'] = result.inserted_id
        return json.loads(json_util.dumps(data)), 201

@ns.route('/<string:id>')
@ns.response(404, 'Procedure not found')
@ns.param('id', 'The procedure identifier')
class ProcedureResource(Resource):
    @ns.doc('get_procedure')
    def get(self, id):
        """Fetch a single procedure by its ID"""
        procedure = col.find_one({'_id': ObjectId(id)})
        if procedure is None:
            api.abort(404, "Procedure not found")
        return json.loads(json_util.dumps(procedure))

    @ns.doc('update_procedure')
    @ns.expect(data_model)
    @ns.marshal_with(data_model)
    def put(self, id):
        """Update an existing procedure"""
        data = request.json
        result = col.update_one({'_id': ObjectId(id)}, {"$set": data})
        if result.matched_count == 0:
            api.abort(404, "Procedure not found")
        updated_procedure = col.find_one({'_id': ObjectId(id)})
        return json.loads(json_util.dumps(updated_procedure)), 200

@ns.route('/<string:ownername>/<string:patientname>')
@ns.response(404, 'Procedures not found')
class ProcedureByOwnerAndPatient(Resource):
    @ns.doc('get_procedures_by_owner_and_patient')
    def get(self, ownername, patientname):
        """Fetch procedures by owner and patient name"""
        procedures = list(col.find({
            'ownername': {'$regex': f'^{ownername}$', '$options': 'i'},
            'patientname': {'$regex': f'^{patientname}$', '$options': 'i'}
        }))
        if not procedures:
            api.abort(404, "Procedures not found")
        return json.loads(json_util.dumps(procedures))

@ns.route('/<string:ownername>/<string:patientname>/<string:date>')
@ns.response(404, 'Procedures not found')
class ProcedureByOwnerPatientDate(Resource):
    @ns.doc('get_procedures_by_owner_patient_date')
    def get(self, ownername, patientname, date):
        """Fetch procedures by owner, patient name, and date"""
        try:
            target_date = date_parser.parse(date)
        except ValueError:
            api.abort(400, "Invalid date format")
        procedures = list(col.find({
            'ownername': {'$regex': f'^{ownername}$', '$options': 'i'},
            'patientname': {'$regex': f'^{patientname}$', '$options': 'i'},
            'procedures.actions.date_time': {
                '$gte': target_date,
                '$lt': target_date.replace(hour=23, minute=59, second=59)
            }
        }))
        if not procedures:
            api.abort(404, "Procedures not found")
        return json.loads(json_util.dumps(procedures))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
