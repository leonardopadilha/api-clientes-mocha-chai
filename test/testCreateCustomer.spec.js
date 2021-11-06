import chai from "chai";
import chaiHttp from "chai-http";
chai.use(require('chai-json-schema'));
import * as constant from "../suports/constants";
import * as requestNewCustomer from "../requests/requestNewCustomer";

chai.use(chaiHttp);
const expect = chai.expect;

const request = chai.request(constant.URL_API_CUSTOMERS);

describe("Postar novo cliente", () => {
    var name = "Homem de Ferro";
    var age = 45;
    var id = "123456";
    var returnIronMan;
    context('quando informo os dados corretamente de um novo cliente com id', () => {
        before((done) => {
            request
                .delete(constant.CUSTOMERS + constant.DELETE_ALL_CUSTOMERS)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.not.property(id);
                    expect(res.body).to.eqls({});
                    done();
                })
        })

        it('então o cliente é cadastrado com sucesso', (done) => {
            request
                .post(constant.CUSTOMERS)
                .send(requestNewCustomer.createCustomerWithId(name, age, id))
                .end((err, res) => {
                    expect(res).to.has.status(201);
                    expect(res.body).to.not.be.an('array');
                    expect(res.body).to.property(id);
                    expect(res.body).to.property(id).to.be.an('Object');

                    returnIronMan = res.body;
                    expect(requestNewCustomer.requestReturnNewUser()).to.be.jsonSchema(returnIronMan);
                    done();
                })
        })
    })

    context('quando informo os dados corretamente de um novo cliente sem id', () => {
        before((done) => {
            request
                .delete(constant.CUSTOMERS + constant.DELETE_ALL_CUSTOMERS)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.not.property(id);
                    expect(res.body).to.eqls({});
                    done();
                })
        })
        it('então o cliente é cadastrado com sucesso e um id deve ser gerado automaticamente', (done) => {
            request
                .post(constant.CUSTOMERS)
                .send(requestNewCustomer.createCustomerWithId(name, age))
                .end((err, res) => {
                    expect(res).to.has.status(201);
                    expect(res.body).to.not.be.an('array');
                    expect(res.body).to.be.an('Object');

                    returnIronMan = res.body;
                    expect(requestNewCustomer.requestReturnNewUser()).to.be.jsonSchema(returnIronMan);
                    done();
                })
        })
    })

    context('quando informo os dados de um novo cliente com um id inválido', () => {
        before((done) => {
            request
                .delete(constant.CUSTOMERS + constant.DELETE_ALL_CUSTOMERS)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.not.property(id);
                    expect(res.body).to.eqls({});
                    done();
                })
        })
        it('então o cliente não deve ser cadastrado', (done) => {
            request
                .post(constant.CUSTOMERS)
                .send(requestNewCustomer.createCustomerWithId(name, age, 'ttsfasd'))
                .end((err, res) => {
                    expect(res).to.has.status(400);
                    expect(res.body).to.not.property(id);
                    expect(res.body.message).to.contains('not a valid Integer value');
                    done();
                })
        })
    })
})