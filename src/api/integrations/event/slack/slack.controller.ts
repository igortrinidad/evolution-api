import * as s3Service from '@api/integrations/storage/s3/libs/minio.server';
import { PrismaRepository } from '@api/repository/repository.service';
import { WAMonitoringService } from '@api/services/monitor.service';
import { configService, Log, Slack } from '@config/env.config';
import { Logger } from '@config/logger.config';
import axios from 'axios';
import { join } from 'path';

import { EmitData, EventController, EventControllerInterface } from '../event.controller';

export class SlackController extends EventController implements EventControllerInterface {
  private readonly logger = new Logger('SlackController');

  public events_available = ['connection.update', 'qrcode.updated'];

  constructor(prismaRepository: PrismaRepository, waMonitor: WAMonitoringService) {
    super(prismaRepository, waMonitor, configService.get<Slack>('SLACK')?.ENABLED, 'slack');
    this.logger.info('Slack constructor');
  }

  private async handleEvents(data: any, channel?: string): Promise<void> {
    if (data.event === 'connection.update') {
      await this.handleConnectionUpdate(data, channel);
    } else if (data.event === 'qrcode.updated') {
      await this.handleQrCodeUpadAndNotifyOnSlack(data, channel);
    }
  }

  private async handleConnectionUpdate(data: any, channel?: string): Promise<void> {
    if (data?.data?.status != 'open') {
      const text = `Connection updated`;
      await this.sendSlackMessage(text, channel);
    }
  }

  private async handleQrCodeUpadAndNotifyOnSlack(data: any, channel?: string): Promise<void> {
    try {
      const message = `A instância *${data.instance}* esta desconectada, acesse o painel <${process.env.SERVER_URL}/manager|Evolution API> para reconectar..`;
      const payload = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: message,
            },
          },
        ],
      };

      await this.sendSlackMessage(payload, channel);
    } catch (error) {
      console.error('error', error);
      this.logger.error(error);
    }
  }

  private async handlQrCodeUpdatedAndSendToSlack(data: any, channel?: string): Promise<void> {
    try {
      const qrCodeFileName = `${Date.now()}_qr_code.png`;
      const s3ObjectKey = join(data.instance, 'qr_codes', qrCodeFileName);

      const base64String = data.data.qrcode.base64.replace(/^data:image\/png;base64,/, '');

      const buffer = Buffer.from(base64String, 'base64');

      await s3Service.uploadFile(s3ObjectKey, buffer, buffer.length, {
        'Content-Type': 'image/png',
      });

      const s3ObjectUrl = await s3Service.getObjectUrl(s3ObjectKey);

      const message = `A instância *${data.instance}* esta desconectada, escaneie o QR Code para acessar o WhatsApp ou acesse o painel <${process.env.SERVER_URL}/manager|Evolution API> para reconectar...`;

      const payload = {
        blocks: [
          {
            type: 'image',
            image_url: s3ObjectUrl,
            alt_text: 'Haunted hotel image',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: message,
            },
          },
        ],
      };

      await this.sendSlackMessage(payload, channel);
    } catch (error) {
      console.error('error', error);
      this.logger.error(error);
    }
  }

  public init(): void {
    if (!this.status) {
      return;
    }

    this.logger.info('Slack initialized');
  }

  public async sendSlackMessage(payload: any, channel?: string): Promise<void> {
    const channelUrl = channel ? channel : configService.get<Slack>('SLACK')?.CHANNEL_WEBHOOK_URL;
    const httpService = axios.create();
    await httpService.post(channelUrl, payload, { headers: { 'Content-Type': 'application/json' } });
  }

  public async emit({
    instanceName,
    origin,
    event,
    data,
    serverUrl,
    dateTime,
    sender,
    apiKey,
  }: EmitData): Promise<void> {
    const configEv = event.replace(/[.-]/gm, '_').toUpperCase();
    const logEnabled = configService.get<Log>('LOG').LEVEL.includes('SLACK');
    try {
      if (!this.status) {
        return;
      }
      const message = {
        event,
        instance: instanceName,
        data,
        server_url: serverUrl,
        date_time: dateTime,
        sender,
        apikey: apiKey,
      };

      if (configService.get<Slack>('SLACK')?.GLOBAL_ENABLED) {
        await this.handleEvents(message);

        const instance = await this.get(instanceName);

        if (!instance?.enabled) {
          return;
        }

        if (Array.isArray(instance?.events) && instance?.events.includes(configEv)) {
          // Here goes the emit to slack channel
          // this.socket.of(`/${instanceName}`).emit(event, message);
          // await this.handleEvents(message, instance.channelWebhookUrl);
        }
        if (logEnabled && this.events_available.includes(data.event)) {
          this.logger.log({
            local: `${origin}.sendData-Slack`,
            ...message,
          });
        }
      }
    } catch (err) {
      if (logEnabled && this.events_available.includes(data.event)) {
        this.logger.error(err);
      }
    }
  }
}
