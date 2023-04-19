import AsyncStorage from "@react-native-async-storage/async-storage";

//Below will be all the api functions 
// ensure modular and Clean Code base architecure 


//The Chat Management Api functions: 

export const getContactList = async () => {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    return fetch("http://localhost:3333/api/1.0.0/contacts", {
        method: 'GET',
        headers: {
            'X-Authorization': token
        }
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const userLogsin = async (data) => {
       return fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'},
        body: JSON.stringify(data),
     })
     //handling the response 
     .then((response) => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 400) {
            throw "Invalid use of Email / password you have supplied"
        } else {
            throw "Server Error"
        }
    })

// storing contact id and also the token in the local storgae 
// such that it can be used in the application
    .then((reqJson) => {
        console.log(reqJson)
        const { token, id } = reqJson;
        AsyncStorage.setItem('whatsthat_session_token', token);
        AsyncStorage.setItem('id', id.toString());
    })
    .catch((error) => {
        console.log(error);
    })
}
