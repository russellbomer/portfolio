# Systemd Services for Portfolio

This directory contains systemd service and timer files for the portfolio application.

## Services

### `quarry-restart.service` + `quarry-restart.timer`

Daily restart of the quarry-sandbox Docker container to clear accumulated tmpfs data.

**Why?** The container uses tmpfs for `/home/quarry` which accumulates data across terminal sessions. While session directories in `/home/quarry/output/` are cleaned on disconnect, other working files (`.quarry/`, caches, etc.) persist until container restart.

**Schedule:** Daily at 04:00 local time (±5 min random delay)

## Installation

```bash
# Copy service files to systemd directory
sudo cp deploy/systemd/quarry-restart.* /etc/systemd/system/

# Reload systemd to pick up new files
sudo systemctl daemon-reload

# Enable and start the timer
sudo systemctl enable --now quarry-restart.timer

# Verify timer is scheduled
sudo systemctl list-timers | grep quarry
```

## Manual Operations

```bash
# Trigger immediate container restart
sudo systemctl start quarry-restart.service

# Check timer status
sudo systemctl status quarry-restart.timer

# View logs
sudo journalctl -u quarry-restart.service

# Disable the timer
sudo systemctl disable quarry-restart.timer
```

## Other Services

The terminal WebSocket server runs via `terminal.service` (located in `deploy/terminal.service`).
