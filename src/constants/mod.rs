use std::time::Duration;

pub const MAIN_ROOM_NAME: &'static str = "World";
pub const MAIN_ROOM_ID: usize = 0;

pub const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
pub const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);
