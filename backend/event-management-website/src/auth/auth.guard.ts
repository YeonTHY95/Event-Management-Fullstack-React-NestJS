import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   return true;
  // }

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log("Inside AuthGuard CanActivate, Request: ", Object.entries(request));
    // console.log("Inside AuthGuard CanActivate, Cookies: ", request.cookies);
    // const accessToken = request.cookies['access_token'] ;
    // console.log("Inside AuthGuard CanActivate, Access Token: ", accessToken);
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new ForbiddenException();
    }
    try {
      console.log("Inside AuthGuard CanActivate, Verifying access token");
      const payload = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: process.env.ACCESS_TOKEN_SECRET 
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      console.log("Inside AuthGuard CanActivate, Access token verified successfully, Payload: ", payload);
    } 
    catch (error) {
      console.log("Inside AuthGuard CanActivate, Error verifying access token: ", error);
      throw new ForbiddenException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers['authorization'];
    const [type, token] = authorizationHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }


}
