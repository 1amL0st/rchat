pub fn user_joined_room(text: String) -> String {
    make(&text, &"UserJoinedRoom".to_string())
}

pub fn user_connected(text: &String) -> String {
    make(text, &"UserConnected".to_string())
}

pub fn user_left_room_custom_text(text: &String) -> String {
    make(text, &"UserLeftRoom".to_string())
}

pub fn user_left_room(login: &String) -> String {
    make(
        &format!("User {} has left this room!", login),
        &"UserLeftRoom".to_string(),
    )
}

pub fn logging_fail(err_text: &String) -> String {
    make(err_text, &"LoggingFailed".to_string())
}

pub fn logging_success() -> String {
    make(&"".to_string(), &"LoggingSuccess".to_string())
}

pub fn room_creation_fail(err_text: String) -> String {
    make(&err_text, &"RoomCreationFail".to_string())
}

pub fn make(text: &String, sub_type: &String) -> String {
    serde_json::json!({
        "type": "ServerMsg",
        "subType": sub_type,
        "text": text
    })
    .to_string()
}
