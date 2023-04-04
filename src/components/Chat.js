import Axios from "axios";
import { useEffect, useState, useRef } from "react";
import Talk from "talkjs";

export const Chat = (props) => {
  const chatboxEl = useRef();
  const [profilData, setProfilData] = useState({
    email: "",
    nume: "",
    poza_profil: "",
    prenume: "",
    user_id: 0,
  });
  // wait for TalkJS to load
  const [talkLoaded, markTalkLoaded] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    Axios.get("http://localhost:3002/api/chat/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setProfilData(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    setTimeout(() => {
      Talk.ready.then(() => markTalkLoaded(true));
      if (talkLoaded) {
        const currentUser = new Talk.User({
          id: profilData.user_id,
          name: `${profilData.nume} ${profilData.prenume}`,
          email: profilData.email,
          photoUrl: null,
          welcomeMessage: "Hello!",
          role: "default",
        });

        const otherUser = new Talk.User({
          id: props.chatData.user_id,
          name: props.chatData.nume,
          email: "jessicawells@example.com",
          photoUrl: null,
          welcomeMessage: "Hello!",
          role: "default",
        });

        const session = new Talk.Session({
          appId: "trEcbqOA",
          me: currentUser,
        });

        const conversationId = Talk.oneOnOneId(currentUser, otherUser);
        const conversation = session.getOrCreateConversation(conversationId);
        conversation.setParticipant(currentUser);
        conversation.setParticipant(otherUser);

        const chatbox = session.createChatbox();
        chatbox.select(conversation);
        chatbox.mount(chatboxEl.current);

        return () => session.destroy();
      }
    }, 1000);
  }, [talkLoaded]);

  return (
    <div>
      <div className="chat" ref={chatboxEl} />
    </div>
  );
};
