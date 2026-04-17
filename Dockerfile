# ── Stage 1: Use official lightweight Nginx image ──────────────────────────
FROM nginx:alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy all static assets into the Nginx web root
COPY . /usr/share/nginx/html

# Cloud Run requires the container to listen on PORT env var (default 8080)
# Override default Nginx port from 80 → 8080
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf && \
    sed -i 's/listen\s*\[::\]:80;/listen [::]:8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
