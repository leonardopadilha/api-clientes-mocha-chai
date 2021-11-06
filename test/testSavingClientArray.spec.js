import chai from "chai";
import chaiHttp from "chai-http";
import * as constant from "../suports/constants";

chai.use(chaiHttp);
const expect = chai.expect;

const request = chai.request(constant.URL_API_CUSTOMERS);

describe('Criando vários clientes', () => {
    context('quando incluo vários clientes com dados válidos', () => {

        before((done) => {

            let task = {"nome": "Batman", "idade": 55, "id": "2236"}
            
            request
                .post(constant.CUSTOMERS)
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(201);
                    done();
                })
        })
            
        it('os clientes são cadastrados com sucesso', (done) => {
         chai.request("localhost:8080")
                .get("/")
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body).to.not.eqls({});
                    expect(res.body).to.not.be.empty;
                    done();
                    
                })
            })

            after((done) => {
                request
                    .delete(constant.CUSTOMERS + constant.DELETE_ALL_CUSTOMERS)
                    .end((err, res) => {
                        expect(res).to.has.status(200);
                        expect(res.body).to.be.empty;
                        done();
                    })
            })
    })
})