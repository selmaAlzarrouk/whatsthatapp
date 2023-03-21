//here i wil write the sign up request first as it makes mose sense , we need accounts to work with

// defina a function
//where signupUser is the name of the functions 

//to_send is the props 
//note to self not all funcs will need props aka parameters 

export const signupUser = async (to_send) => {
    //here is the request to the server done by fetch
    //follwed by the url , managing the pathand then define the method , headers
    //which will either be  content type or x-authorization and body of data 
    return fetch("http://localhost:3333/api/1.0.0/user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)

    })


        /*below is handling the response and errors so here 
        am handling a response 201 ehich is createdas in created an account in that case 
        am returning hson anything else is an error   */

        .then((response) => {
            if (response.status === 201) {
                return response.json();
            } else if (response.status === 400) {
                throw "Sorry this password isnt powerful or the email is already in use"
            } else {
                throw "Oh Dear something has gone wrong :<"
            }

        })
        .then((rJson) => {
            console.log(rJson)
        })
        .catch((error) => {
            console.log(error)
        })

}