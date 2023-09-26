import { LogEntryBase, LogEntryError, LogEntryExecutionInfo, LogEntryInfo, LogEntryJobProcessingInfo, LogEntryServiceEntity } from '.';

const newrelicFormatter = require('@newrelic/winston-enricher');
const winston = require('winston');
const newrelicWinstonFormatter = newrelicFormatter(winston);
const { createLogger, format, transports } = require('winston');
const _ = require('lodash');
const maskJson = require('mask-json');
const packagejson = require('../../package.json');
const { SbxApp } = require('@sbx/sbx-archetype-api-default');

import { als } from '@sbx/sbx-core-als';

export class LoggerThreaded {
  logger;
  maskLogMessage;
  executionInfo?: LogEntryServiceEntity;

  static loglevels = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    debug: 'debug'
  };

  private static instance: LoggerThreaded;

  public static test: string = 'test';

  static getTest() {
    return 'test';
  }

  static getInstance() {
    if (!LoggerThreaded.instance) {
      LoggerThreaded.instance = new LoggerThreaded(
        SbxApp.getInstance().sbxcore
      );
    }
    return LoggerThreaded.instance;
  }

  constructor(private readonly core) {
    let loglevel = LoggerThreaded.loglevels.info;
    if (
      process.env.loglevel &&
      process.env.loglevel in LoggerThreaded.loglevels
    ) {
      loglevel = process.env.loglevel;
    }

    let maskFields = [];
    /* ssm parameter value of /sbx/{region}/{env}/config/global/standardSecureFields */
    if (
      core.config.get('standardSecureFields') &&
      core.config.get('standardSecureFields').split(',')
    ) {
      maskFields = maskFields.concat(
        core.config.get('standardSecureFields').split(',')
      );
    }
    /* api specific secure fields read from the file secure-data-fields.json */
    if (core.config.get('secureFields')) {
      maskFields = maskFields.concat(core.config.get('secureFields'));
    }

    this.maskLogMessage = maskJson(maskFields).bind(this);
    // newrelicWinstonFormatter(),
    this.logger = createLogger({
      level: loglevel,
      format: format.combine(newrelicWinstonFormatter(), format.timestamp()),
      transports: [
        new transports.Console({
          handleExceptions: false
        })
      ],
      exitOnError: false
    });

    this.setExecutionContext(core.config.getExecutionContext());

    this.info({ message: `LoggerThreaded started` });
  }

  setJsonMaskFields(maskFields) {
    this.maskLogMessage = maskJson(maskFields);
  }

  setExecutionContext(executionContext: LogEntryServiceEntity) {
    if (executionContext === undefined) return;
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      ...executionContext,
      ...{
        executionContext: JSON.stringify(
          this.safeMask(
            _.pick(executionContext, [
              'system',
              'subssytem',
              'capability',
              'resource'
            ])
          )
        ),
        container_name: `sbx-${executionContext.subssytem}-${executionContext.capability}-${executionContext.resource}`,
        namespace_name: `${process.env.NODE_ENV}`,
        sbxloggerversion: '5.0',
        appVersion: packagejson.version        
      }
    };
  }

  setExecutionInfo(executionInfo: LogEntryExecutionInfo) {
    if (executionInfo === undefined) return;
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      ...executionInfo,
      ...{
      }
    };
  }  

  appendDefaultMeta(key, value) {
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      [key]: value
    };
  }

  info(message: LogEntryInfo | LogEntryJobProcessingInfo) {
    return this.logger.info(this.safeMask(this.addContext(message)));
  }

  error(message: LogEntryError) {
    return this.logger.error(this.safeMask(this.addContext(message)));
  }

  warn(message: LogEntryError) {
    return this.logger.warn(this.safeMask(this.addContext(message)));
  }

  debug(message: LogEntryBase) {
    return this.logger.debug(this.safeMask(this.addContext(message)));
  }

  verbose(message: LogEntryBase) {
    return this.logger.verbose(this.safeMask(this.addContext(message)));
  }

  safeMask(item, level = 2) {
    if (_.isObject(item)) {
      if (level < 1) return this.safeStringify(item);
      return _.reduce(
        item,
        (result, value, key) => {
          result[key] = _.isString(value)
            ? this.maskLogMessage(value)
            : this.safeMask(value, level - 1);
          return result;
        },
        {}
      );
    }
    return this.maskLogMessage(item);
  }

  safeStringify(item) {
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache: any[] = [];
    const res = JSON.stringify(item, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return;

        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    // cache = null; // Enable garbage collection
    return res;
  }

  addContext(message) {
    try {

      const info: LogEntryExecutionInfo = {};

      if (als.getStore() !== undefined) {
        const context: any = als.getStore();
        info.transactionid = context.get('transactionid');
        info.identity = context.set('identity');
        info.scope = context.set('scope');
        info.correlationid = context.set('correlationid');
        info.urlpath = context.set('urlpath');
        info.sender = context.set('sender');
        info.sessionid = context.set('sessionid');
      }

      info.transactionid = info.transactionid || message.transactionid || '';
      info.identity = info.identity || message.identity || '';
      info.scope = info.scope || message.scope || '';
      info.correlationid = info.correlationid || message.correlationid || '';
      info.sender = info.sender || message.sender || '';
      info.sessionid = info.sessionid || message.sessionid || '';
      info.sender = info.sender || message.sender || '';

      return Object.assign(
        {},
        message,
        info,
        this.logger.defaultMeta || {}
      );
    } catch (err) {
      console.error(err);
    }
  }
}
