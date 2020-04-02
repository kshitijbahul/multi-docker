docker build -t kshitijbahul/multi-client:latest -t kshitijbahul/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t kshitijbahul/multi-server:latest -t kshitijbahul/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t kshitijbahul/multi-worker:latest -t kshitijbahul/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push kshitijbahul/multi-client:latest
docker push kshitijbahul/multi-client:$SHA

docker push kshitijbahul/multi-server:latest
docker push kshitijbahul/multi-server:$SHA

docker push kshitijbahul/multi-worker:latest
docker push kshitijbahul/multi-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/client-deployment client=kshitijbahul/multi-client:$SHA
kubectl set image deployments/server-deployment client=kshitijbahul/multi-server:$SHA
kubectl set image deployments/worker-deployment client=kshitijbahul/multi-worker:$SHA