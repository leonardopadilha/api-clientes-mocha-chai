import chai from "chai";
import chaiHttp from "chai-http";
chai.use(require('chai-json-schema'));
import * as constant from "../suports/constants";
import * as requestNewCustomer from "../requests/requestNewCustomer";

chai.use(chaiHttp);
const expect = chai.expect;

const request = chai.request(constant.URL_API_CUSTOMERS);

describe('Atualizar cliente', () => {
    var name = "Hulk";
    var age = 90;
    var id = "654321";
    var returnIronMan;
    var customerId;
    context('quando atualizo um cliente que não esteja cadastrado', () => {
        before((done) => {
            request
                .delete(constant.CUSTOMERS + constant.DELETE_ALL_CUSTOMERS)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.eqls({});
                    done();
                })
        })
        it('então o sistema me retorna a informação que o cliente não existe', (done) => {
            request
                .put(constant.CUSTOMERS)
                .send(requestNewCustomer.createCustomerWithId(name, age, id))
                .end((err, res) => {
                    expect(res).to.has.status(404);
                    expect(res.body).to.eqls({});
                    done();
                })
        })
    })

    context('quando cadastro um novo cliente', () => {
        before((done) => {
            request 
                .post(constant.CUSTOMERS)
                .send(requestNewCustomer.createCustomerWithId(name, age, id))
                .end((err, res) => {
                    expect(res).to.has.status(201);
                    expect(res.body).to.property(id);
                    
                    returnIronMan = res.body;
                    expect(requestNewCustomer.requestReturnNewUser()).to.be.jsonSchema(returnIronMan);
                    done();
                })
        })

        it('e pesquiso o novo cliente cadastrado para realizar a alteração', (done) => {
            request
                .get(constant.CUSTOMERS + id)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.nome).to.eqls(name)
                    expect(res.body.idade).to.eqls(age);

                    customerId = res.body.id;
                    expect(res.body.id).to.eqls(customerId);
                    done();
                })
        })

        it('então atualizo e confirmo as alterações com sucesso', (done) => {
            request
                .put(constant.CUSTOMERS)
                .send(requestNewCustomer.createCustomerWithId("Homem Aranha", 18, id))
                .end((err, res) => {
                    expect(res).to.has.status(200);

                    customerId = res.body.id;
                    expect(res.body.id).to.eqls(customerId);

                    let customerAge = res.body.idade;
                    expect(res.body.idade).to.eqls(customerAge);

                    let customerName = res.body.nome;
                    expect(res.body.nome).to.eqls(customerName);
                    done();
                })
        })

        after((done) => {
            request
                .delete(constant.CUSTOMERS + constant.DELETE_ALL_CUSTOMERS)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.eqls({});
                    done();
                })
        })
    })
})