//
//  NotificationService.m
//  ExtensionForExample
//
//  Created by Miroljub Stoilkovic on 03/03/2021.
//

#import "NotificationService.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
       self.contentHandler = contentHandler;
       self.bestAttemptContent = [request.content mutableCopy];
        
       NSString *urlString = request.content.userInfo[@"ios_apx_media"];
        
       [self loadAttachmentForUrlString:urlString
                      completionHandler:^(UNNotificationAttachment *attachment) {
                          if (attachment) {
                              self.bestAttemptContent.attachments = [NSArray arrayWithObject:attachment];
                          }
                          self.contentHandler(self.bestAttemptContent);
                      }];

}

- (void)serviceExtensionTimeWillExpire {
   // Called just before the extension will be terminated by the system.
   // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
   self.contentHandler(self.bestAttemptContent);
}

- (void)loadAttachmentForUrlString:(NSString *)urlString completionHandler:(void(^)(UNNotificationAttachment *))completionHandler  {
    
   __block UNNotificationAttachment *attachment = nil;
   NSURL *attachmentURL = [NSURL URLWithString:urlString];

  [[[NSURLSession sharedSession] downloadTaskWithURL:attachmentURL completionHandler:^(NSURL * _Nullable location, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    if (error != nil) {
        NSLog(@"%@", error.localizedDescription);
    } else {
      NSString *dir = NSTemporaryDirectory();
      NSString *tempFile = [NSString stringWithFormat:@"%@%@%@", @"file://", dir, [attachmentURL lastPathComponent]];
      NSURL *tmpUrl = [NSURL URLWithString:tempFile];
      
      NSFileManager *fileManager = [NSFileManager defaultManager];
      [fileManager moveItemAtURL:location toURL:tmpUrl error:&error];
       
      NSError *attachmentError = nil;
      attachment = [UNNotificationAttachment attachmentWithIdentifier:@"" URL:tmpUrl options:nil error:&attachmentError];
      if (attachmentError) {
        NSLog(@"%@", attachmentError.localizedDescription);
      }
    }
    completionHandler(attachment);
  }] resume];
}

@end
