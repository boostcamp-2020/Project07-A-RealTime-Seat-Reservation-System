import SocketWorker from "./SocketWorker";

function WebSharedWorker(worker) {
  const code = worker.toString();
  const blob = new Blob(["(" + code + ")()"]);

  return new Worker(URL.createObjectURL(blob));
}

export default WebSharedWorker(SocketWorker);
