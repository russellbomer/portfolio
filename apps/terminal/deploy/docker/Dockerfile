# Quarry Sandbox Container
# Provides isolated environment for terminal demo with quarry CLI

FROM node:20-alpine

# Install minimal dependencies for PTY and shell
RUN apk add --no-cache \
    bash \
    curl \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN adduser -D -s /bin/bash quarry

# Create directories for session outputs
RUN mkdir -p /home/quarry/output && chown -R quarry:quarry /home/quarry

# Install quarry CLI globally
# TODO: Replace with actual quarry package when published
# RUN npm install -g @russellbomer/quarry

# Set working directory
WORKDIR /home/quarry

# Switch to non-root user
USER quarry

# Default shell for interactive sessions
CMD ["/bin/bash"]
