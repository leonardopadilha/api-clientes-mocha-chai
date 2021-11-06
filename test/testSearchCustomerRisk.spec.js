import chai from "chai";
import chaiHttp from "chai-http";
import * as constant from "../suports/constants";
import * as requestNewCustomer from "../requests/requestNewCustomer";

chai.use(chaiHttp);
const expect = chai.expect;

const request = chai.request(constant.URL_API_CUSTOMERS);

describe('Pesquisar cliente por risco', () => {
    var name = "Soldado Invernal";
    var age = 98;
    var id = "159753";
    var risk = 17;
    var customerRisk;
    var customerId;
    context('pesquiso sem permissão por um cliente baseado no risco', () => {
        before((done) => {
            request 
                .post(constant.CUSTOMERS)
                .send(requestNewCustomer.createCustomerWithId(name, age, id, risk))
                .end((err, res) => {
                    expect(res).to.has.status(201);
                    expect(res.body).to.property(id);

                    customerId = res.body.id;
                    expect(res.body.id).to.eqls(customerId);

                    customerRisk = res.body.risco;
                    expect(res.body.risco).to.eqls(customerRisk);
                    done();
                })
        })
        it('então o sistema deve retornar Unauthorized', (done) => {
            request
                .get(constant.CUSTOMER_RISK + risk)
                .end((err, res) => {
                    expect(res).to.has.status(401)

                    expect(res.body.message).to.eqls('Unauthorized');
                    done();
                })
        })

        after((done) => {
            request
                .delete(constant.CUSTOMERS + constant.DELETE_ALL_CUSTOMERS)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.eqls({});
                    expect(res.body).to.not.property(id);
                    done();
                })
        })
    })

    context('quando pesquiso com permissão por um cliente baseado no risco', () => {
        before((done) => {
            request 
                .post(constant.CUSTOMERS)
                .send(requestNewCustomer.createCustomerWithId(name, age, id, risk))
                .end((err, res) => {
                    expect(res).to.has.status(201);
                    expect(res.body).to.property(id);

                    customerId = res.body.id;
                    expect(res.body.id).to.eqls(customerId);

                    customerRisk = res.body.risco;
                    expect(res.body.risco).to.eqls(customerRisk);
                    done();
                })
        })

        it('então o cliente deve ser exibido com sucesso', (done) => {
            request
                .get(constant.CUSTOMER_RISK + id)
                .auth('aluno', 'senha')
                .end((err, res) => {
                    expect(res).to.has.status(200);

                    let customerName = res.body.nome;
                    expect(res.body.nome).to.eqls(customerName);
 
                    customerRisk = res.body.risco;
                    expect(res.body.risco).to.eqls(customerRisk);
                    done();
                })

        })

        after((done) => {
            request
                .delete(constant.CUSTOMERS + constant.DELETE_ALL_CUSTOMERS)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.eqls({});
                    expect(res.body).to.not.property(id);
                    done();
                })
        })
    })
})