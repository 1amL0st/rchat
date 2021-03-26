pub fn user_list_msg(users: &Vec<String>) -> String {
    serde_json::json!({
        "type": "DataMsg",
        "subType": "UserList",
        "users": users
    })
    .to_string()
}

pub fn room_list_msg(rooms: &Vec<String>) -> String {
    serde_json::json!({
        "type": "DataMsg",
        "subType": "RoomList",
        "rooms": rooms
    })
    .to_string()
}

pub fn current_room_msg(room: String) -> String {
    serde_json::json!({
        "type": "DataMsg",
        "subType": "CurRoom",
        "name": room
    })
    .to_string()
}
