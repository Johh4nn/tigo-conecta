import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat';
import { AuthService, UserProfile } from 'src/app/core/services/auth';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content!: IonContent;

  contratacionId = "";
  messages: any[] = [];
  newMessage = "";
  profile: UserProfile | null = null;
  channel: any = null;
  loading = false;
  error = "";

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService,
    private auth: AuthService,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.contratacionId = this.route.snapshot.paramMap.get("id") ?? "";
    this.profile = await this.auth.getProfile();

    if (!this.contratacionId) {
      this.error = "ID de contratación no válido";
      this.loading = false;
      return;
    }

    if (!this.profile?.id) {
      this.error = "No se pudo cargar el perfil del usuario";
      this.loading = false;
      return;
    }

    try {
      const { data, error } = await this.chat.getMessagesByContratacion(
        this.contratacionId, 
        this.profile.id
      );
      
      if (error) {
        this.error = error.message;
      } else {
        this.messages = data ?? [];
        this.scrollToBottom();
      }

      // Suscribirse a cambios en tiempo real
      this.channel = this.chat.onMessagesRealtime(
        this.contratacionId,
        (msg: any) => {
          const r = msg?.new ?? msg?.record;
          this.zone.run(() => {
            this.messages.push(r);
            this.scrollToBottom();
          });
        }
      );

    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.channel?.unsubscribe?.();
    this.channel?.remove?.();
  }

  async send() {
    if (!this.profile?.id) {
      this.error = "⛔ No hay perfil cargado";
      return;
    }

    const text = this.newMessage.trim();
    if (!text) return;

    this.error = "";
    const payload = {
      contratacion_id: this.contratacionId,
      usuario_id: this.profile.id,
      mensaje: text,
      tipo: "texto"
    };

    try {
      const { data, error } = await this.chat.sendMessage(payload);
      if (error) {
        this.error = error.message;
      } else {
        this.messages.push(data);
        this.newMessage = "";
        this.scrollToBottom();
      }
    } catch (err: any) {
      this.error = err.message;
    }
  }

  isMine(m: any) {
    return m.usuario_id === this.profile?.id;
  }

  scrollToBottom() {
    setTimeout(() => this.content?.scrollToBottom(300), 50);
  }
}