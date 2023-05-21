import AsyncStorage from '@react-native-async-storage/async-storage';

// Below will be all the api functions
// ensure modular and Clean Code base architecure

// The Chat Management Api functions:

export const getContactList = async () => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch('http://localhost:3333/api/1.0.0/contacts', {
    method: 'GET',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => response.json())
    .then((responseJson) => responseJson)
    .catch((error) => {
      console.log(error);
    });
};

export const userLogsin = async (data, success, failure) => fetch('http://localhost:3333/api/1.0.0/login', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify(data),
})
// handling the response
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    } if (response.status === 400) {
      throw 'Invalid use of Email / password you have supplied';
    } else {
      throw 'Server Error';
    }
  })
  .then((responseJson) => {
    success(responseJson);
  })
  .catch((error) => {
    failure(error);
  });

export const getContactAccount = async (user_id, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
    method: 'GET',
    headers: {

      'X-Authorization': token,
      // 'Content-Type': "application/json"
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 401) {
        throw 'Unauthroised';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};
export const getSingleChat = async (chat_id, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
    method: 'GET',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 403) {
        throw ' Forbidden';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};

// API Function for Contact CHats functionality !
export const getContactLisData = async (success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch('http://localhost:3333/api/1.0.0/contacts', {
    method: 'GET',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 401) {
        throw ' Unauthorised';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};

export const getListChats = async (success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch('http://localhost:3333/api/1.0.0/chat', {
    method: 'GET',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 401) {
        throw ' Unauthorised';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};

export const getBlockedContacts = async (success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch('http://localhost:3333/api/1.0.0/blocked', {
    method: 'GET',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 401) {
        throw ' Unauthorised';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};

export const sendMessage = async (chat_id, mssg, success, failure) => {
  const data = { message: mssg };
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message/`, {
    method: 'POST',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 400) {
        throw ' Bad Request';
      } else if (response.status === 401) {
        throw ' Unauthorised';
      } else if (response.status === 403) {
        throw ' Forbidden';
      } else if (response.status === 404) {
        throw ' Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const blockContact = async (user_id, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/block`, {
    method: 'POST',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 400) {
        throw " You Can't Block yourself";
      } else if (response.status === 401) {
        throw ' Unauthorised';
      } else if (response.status === 404) {
        throw ' Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const unblockContact = async (user_id, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/block`, {
    method: 'delete',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 400) {
        throw 'You cannot  Block yourself';
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const PatchUserData = async (user_id, data, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
    method: 'PATCH',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 400) {
        throw 'Something Went Wrong, please check your input again';
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 403) {
        throw 'Forbidden';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};

export const userLogout = async (success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch('http://localhost:3333/api/1.0.0/logout', {
    method: 'POST',
    headers: {
      'X-Authorization': token,
      'content-type': 'application/json',
    },

  })
  // handling the response
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 401) {
        throw 'Unauthorized';
      } else {
        throw 'Server Error';
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};
export const deleteContact = async (user_id, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
    method: 'delete',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 400) {
        throw 'You cannot remove yourself as a user';
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then(() => {
      success();
      console.log('WEEWOO');
    })
    .catch((error) => {
      failure(error);
    });
};

export const createChat = async (chatName, success, failure) => {
  const data = { name: chatName };
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch('http://localhost:3333/api/1.0.0/chat', {
    method: 'POST',
    headers: {
      'X-Authorization': token,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  // handling the response
    .then((response) => {
      if (response.status === 201) {

      } else if (response.status === 400) {
        throw 'Bad';
      } else {
        throw 'Server Error';
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};
export const addUsertoChat = async (chat_id, user_id, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/user/${user_id}`, {
    method: 'POST',
    headers: {
      'X-Authorization': token,
      'content-type': 'application/json',
    },
  })
  // handling the response
    .then((response) => {
      if (response.status === 201) {

      } else if (response.status === 400) {
        throw 'Bad';
      } else {
        throw 'Server Error';
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const getAccountPhoto = async (user_id, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/photo`, {
    method: 'GET',
    headers: {

      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.blob();
      } if (response.status === 401) {
        throw 'Unauthroised';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseblob) => {
      success(responseblob);
    })
    .catch((error) => {
      failure(error);
    });
};

export const PatchChatName = async (chat_id, data, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}`, {
    method: 'PATCH',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 400) {
        throw 'Something Went Wrong, please check your input again';
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 403) {
        throw 'Forbidden';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};

export const deleteMessage = async (chat_id, message_id, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`, {
    method: 'delete',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 400) {
        throw 'Bad Request';
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 403) {
        throw 'Forbidden';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then(() => {
      success();
      console.log('WEEWOO');
    })
    .catch((error) => {
      failure(error);
    });
};

export const editMessage = async (chat_id, message_id, data, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chat_id}/message/${message_id}`, {
    method: 'PATCH',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {

      } else if (response.status === 400) {
        throw 'Something Went Wrong, please check your input again';
      } else if (response.status === 401) {
        throw 'Unauthorised';
      } else if (response.status === 403) {
        throw 'Forbidden';
      } else if (response.status === 404) {
        throw 'Not Found';
      } else {
        throw 'Server Error';
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};
