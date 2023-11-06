export async function createSession({ ctx, socket, request }){

	return {
		close(){
			socket.close()
		}
	}
}