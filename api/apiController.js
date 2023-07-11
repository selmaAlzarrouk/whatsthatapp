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
    .catch((error) => error);
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
      const newError = 'Invalid use of Email / password you have supplied';
      throw newError;
    } else {
      const newError = 'Server Error';
      throw newError;
    }
  })
  .then((responseJson) => {
    success(responseJson);
  })
  .catch((error) => {
    failure(error);
  });

export const getContactAccount = async (userId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
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
        const newError = 'Unauthroised';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};
export const getSingleChat = async (chatId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
    method: 'GET',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } if (response.status === 403) {
        const error = 'Forbidden';
        throw error;
      } else if (response.status === 404) {
        const error = 'Not Found';
        throw error;
      } else {
        const error = 'Server Error';
        throw error;
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
        const error = 'Unauthorised';
        throw error;
      } else {
        const error = 'Sever Error';
        throw error;
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
        const newError = 'Unauthorised';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
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
        const err = 'Unauthorised';
        throw err;
      } else {
        const err = 'Server Error';
        throw err;
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};

export const sendMessage = async (chatId, mssg, success, failure) => {
  const data = { message: mssg };
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/`, {
    method: 'POST',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = ' Bad Request';
        throw newError;
      } else if (response.status === 401) {
        const newError = ' Unauthorised';
        throw newError;
      } else if (response.status === 403) {
        const newError = 'Forbidden';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const blockContact = async (userId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
    method: 'POST',
    headers: {
      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = 'You Cannot Block yourself';
        throw newError;
      } else if (response.status === 401) {
        const newError = ' Unauthorised';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const unblockContact = async (userId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
    method: 'delete',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = 'You CannotBlock yourself';
        throw newError;
      } else if (response.status === 401) {
        const newError = 'Unauthorised';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const PatchUserData = async (userId, data, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
    method: 'PATCH',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = 'Something Went Wrong, please check your input again';
        throw newError;
      } else if (response.status === 401) {
        const newError = 'Unauthorised';
        throw newError;
      } else if (response.status === 403) {
        const newError = 'Fobidden';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
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
    .then(async (response) => {
      if (response.status === 200) {
        await AsyncStorage.removeItem('whatsthat_session_token');
        await AsyncStorage.removeItem('id');
      } if (response.status === 401) {
        await AsyncStorage.removeItem('whatsthat_session_token');
        await AsyncStorage.removeItem('id');
      } else {
        this.props.navigation.navigate('login');
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};
export const deleteUserinChat = async (chatId, userId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
    method: 'delete',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 401) {
        const newError = 'Unauthorised';
        throw newError;
      } else if (response.status === 403) {
        const newError = 'Forbidden';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};
export const deleteContact = async (userId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
    method: 'delete',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = 'You cannot remove yourself as a user';
        throw newError;
      } else if (response.status === 401) {
        const newError = 'Unauthorised';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then(() => {
      success();
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
        return response;
      } if (response.status === 400) {
        const newError = 'Bad';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};
export const addUsertoChat = async (chatId, userId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
    method: 'POST',
    headers: {

      'X-Authorization': token,
      'content-type': 'application/json',
    },
  })
  // handling the response
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = 'Bad';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const getAccountPhoto = async (userId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
    method: 'GET',
    headers: {

      'X-Authorization': token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.blob();
      } if (response.status === 401) {
        const newError = 'Unauthorised';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then((responseblob) => {
      success(responseblob);
    })
    .catch((error) => {
      failure(error);
    });
};

export const PatchChatName = async (chatId, data, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
    method: 'PATCH',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = 'Something Went Wrong, please check your input again';
        throw newError;
      } else if (response.status === 401) {
        const newError = 'Unauthorised';
        throw newError;
      } else if (response.status === 403) {
        const newError = 'Forbidden';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};

export const deleteMessage = async (chatId, messageId, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
    method: 'delete',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = 'Bad Request';
        throw newError;
      } else if (response.status === 401) {
        const newError = 'Unauthorised';
        throw newError;
      } else if (response.status === 403) {
        const newError = 'Forbidden';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then(() => {
      success();
    })
    .catch((error) => {
      failure(error);
    });
};

export const editMessage = async (chatId, messageId, data, success, failure) => {
  const token = await AsyncStorage.getItem('whatsthat_session_token');
  return fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
    method: 'PATCH',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } if (response.status === 400) {
        const newError = 'Something Went Wrong, please check your input again';
        throw newError;
      } else if (response.status === 401) {
        const newError = 'Unauthorised';
        throw newError;
      } else if (response.status === 403) {
        const newError = 'Forbidden';
        throw newError;
      } else if (response.status === 404) {
        const newError = 'Not Found';
        throw newError;
      } else {
        const newError = 'Server Error';
        throw newError;
      }
    })
    .then((responseJson) => {
      success(responseJson);
    })
    .catch((error) => {
      failure(error);
    });
};
