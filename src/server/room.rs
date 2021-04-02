use std::collections::HashSet;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RoomPrivacy {
    Public,
    Private, // Hidden from public list
}

impl Default for RoomPrivacy {
    fn default() -> Self {
        RoomPrivacy::Public
    }
}

#[derive(Debug, Clone, Default)]
pub struct Room {
    pub name: String,
    pub users: HashSet<String>,

    pub privacy: RoomPrivacy,
}

impl Room {
    pub fn new(name: String, users: HashSet<String>, privacy: RoomPrivacy) -> Self {
        Self {
            name,
            users,
            privacy,
        }
    }
}
