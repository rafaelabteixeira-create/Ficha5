# Ficha5
## API

A API utiliza o servidor Express na porta 3000.

 Método  URL  O que recebe  Resposta 

| GET | `/api/cartas` | Não recebe dados | 200 - Devolve todas as cartas em JSON. |
| POST | `/api/cartas` | Nome, tipo, ataque e defesa em JSON | 201 - Devolve a carta criada. |
| POST | `/api/cartas` | Nome ou tipo em falta | 400 - Devolve uma mensagem de erro e não guarda a carta. |

## Network Tab e CORS

O primeiro request é um pedido OPTIONS, chamado preflight, enviado automaticamente pelo browser antes do POST. Serve para verificar se o servidor permite o pedido de origem diferente. Antes de configurar o pacote CORS, o servidor não autorizava esse pedido, pelo que o browser bloqueava o POST. Por isso, o console.log da rota POST nunca aparecia no terminal.

## Persistência dos dados

Na primeira versão, usando apenas setCards, a carta existia apenas no estado do React e desaparecia ao atualizar a página (F5). Na segunda versão, com POST sem ficheiro, a carta ficava apenas na memória do servidor e desaparecia ao reiniciá-lo. Na terceira versão, com POST e cartas.json, a carta era guardada no ficheiro, mantendo-se mesmo depois de atualizar a página ou reiniciar o servidor.
