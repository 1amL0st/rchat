pub fn user_joined_room(text: String) -> String {
    make(&text, &"UserJoinedRoom".to_string())
}

pub fn user_joined_room_fail(err: &String) -> String {
    make(&err, &"UserJoinedRoom".to_string())
}

pub fn user_connected(text: &String) -> String {
    make(text, &"UserConnected".to_string())
}

pub fn user_left_room_custom_text(text: &String) -> String {
    make(text, &"UserLeftRoom".to_string())
}

pub fn user_left_room(login: &String) -> String {
    serde_json::json!({
        "author": "Server",
        "subType": "UserLeftRoom",
        "text": format!("User {} has left room1", login),
        "login": login,
    }).to_string()
}

pub fn logging_fail(err_text: &String) -> String {
    make(err_text, &"LoggingFailed".to_string())
}

pub fn logging_success(new_login: &String) -> String {
    serde_json::json!({
        "author": "Server",
        "subType": "LoggingSuccess",
        "login": new_login
    })
    .to_string()
}

pub fn room_creation_fail(err_text: String) -> String {
    make(&err_text, &"RoomCreationFail".to_string())
}

pub fn make(text: &String, sub_type: &String) -> String {
    serde_json::json!({
        "subType": sub_type,
        "author": "Server",
        "text": text
    })
    .to_string()
}

pub fn room_destroy(room_name: &String) -> String {
    serde_json::json!({
        "author": "Server",
        "subType": "RoomDestroyed",
        "room": room_name
    })
    .to_string()
}

pub fn user_changed_login(old_login: &String, new_login: &String) -> String {
    serde_json::json!({
        "subType": "LoginChangeNotify",
        "author": "Server",
        "oldLogin": old_login,
        "newLogin": new_login,
        "text": format!("User {} has changed its name to {}!", old_login, new_login)
    })
    .to_string()
}