export const createCustomerWithId = (name, age, id = null, risk = null) => {
    return { 
        "nome": name,
        "idade": age,
        "id": id,
        "risco": risk
    }
}

export const requestReturnNewUser = (name = null, age = null, id = null, risk = null) => {
    return {
        id: {
            "nome": name,
            "idade": age,
            "id": id,
            "risco": risk
        }
    }
}