docker image build --tag lucky-wheel/local:latest -f Dockerfile .
docker run -p 8082:8082 -d lucky-wheel/local:latest
